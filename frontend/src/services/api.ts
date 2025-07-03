import axios, { AxiosInstance } from 'axios';
import { 
  User, 
  Course, 
  Department, 
  LoginCredentials, 
  RegisterData, 
  CourseFormData,
  DepartmentFormData,
  Statistics,
  ApiResponse 
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8081',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth headers
    this.api.interceptors.request.use((config) => {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        config.headers['login_email'] = userData.email;
        config.headers['login_password'] = userData.password;
      }
      return config;
    });
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await this.api.post('/login', {}, {
      headers: {
        'login_email': credentials.login_email,
        'login_password': credentials.login_password,
      }
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.get('/logout');
    localStorage.removeItem('user');
  }

  async register(data: RegisterData): Promise<ApiResponse> {
    const response = await this.api.post('/register', {}, {
      headers: {
        'username': data.username,
        'password': data.password,
        'email': data.email,
        'phone': data.phone || '',
      }
    });
    return response.data;
  }

  async registerAdmin(data: RegisterData): Promise<ApiResponse> {
    const response = await this.api.post('/admin/register', {}, {
      headers: {
        'username': data.username,
        'password': data.password,
        'email': data.email,
        'phone': data.phone || '',
        'access_code': 'I_BECOME_THY_ADMIN_AND_I_FUCK_YOUR_MOTHER32131!@#@!#@!',
      }
    });
    return response.data;
  }

  // Users
  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/users');
    return response.data;
  }

  async getStudents(): Promise<User[]> {
    const response = await this.api.get('/students');
    return response.data;
  }

  async getTeachers(): Promise<User[]> {
    const response = await this.api.get('/teachers');
    return response.data;
  }

  async getSelf(): Promise<any> {
    const response = await this.api.get('/self');
    return response.data;
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<ApiResponse> {
    const headers: Record<string, string> = {};
    
    // Only include fields that are actually provided
    if (userData.username !== undefined) headers['username'] = userData.username;
    if (userData.email !== undefined) headers['email'] = userData.email;
    if (userData.phone !== undefined) headers['phone'] = userData.phone;
    if (userData.role !== undefined) headers['role'] = userData.role;
    if (userData.verified !== undefined) headers['verified'] = userData.verified.toString();
    if (userData.suspended !== undefined) headers['suspended'] = userData.suspended.toString();
    
    const response = await this.api.patch(`/admin/users/${userId}`, {}, { headers });
    return response.data;
  }

  async deleteUser(userId: number): Promise<ApiResponse> {
    const response = await this.api.delete(`/admin/users/${userId}`, {
      headers: {
        'user_id': userId.toString(),
      }
    });
    return response.data;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    const response = await this.api.get('/courses');
    return response.data.courses || [];
  }

  async getCourse(courseId: number): Promise<Course> {
    const response = await this.api.get(`/courses/${courseId}`, {
      headers: {
        'id': courseId.toString(),
      }
    });
    return response.data;
  }

  async createCourse(courseData: CourseFormData): Promise<ApiResponse> {
    const response = await this.api.post('/courses', {}, {
      headers: {
        'id': courseData.teacher_id.toString(),
        'name': courseData.course,
        'course_nr': courseData.course_nr,
        'description': courseData.description,
        'cr_cost': courseData.cr_cost.toString(),
        'timeslots': courseData.timeslots,
      }
    });
    return response.data;
  }

  async updateCourse(courseId: number, courseData: Partial<CourseFormData>): Promise<ApiResponse> {
    const response = await this.api.patch(`/courses/${courseId}`, {}, {
      headers: {
        'id': courseData.teacher_id?.toString() || '',
        'name': courseData.course || '',
        'course_nr': courseData.course_nr || '',
        'description': courseData.description || '',
        'cr_cost': courseData.cr_cost?.toString() || '',
        'timeslots': courseData.timeslots || '',
      }
    });
    return response.data;
  }

  async deleteCourse(courseId: number): Promise<ApiResponse> {
    const response = await this.api.delete(`/courses/${courseId}`, {
      headers: {
        'id': courseId.toString(),
      }
    });
    return response.data;
  }

  // Departments
  async getDepartments(): Promise<Department[]> {
    const response = await this.api.get('/departments');
    return response.data;
  }

  async getDepartment(departmentId: number): Promise<Department> {
    const response = await this.api.get(`/departments/${departmentId}`, {
      headers: {
        'id': departmentId.toString(),
      }
    });
    return response.data;
  }

  async createDepartment(data: DepartmentFormData): Promise<ApiResponse> {
    const response = await this.api.post('/departments', {}, {
      headers: {
        'name': data.name,
      }
    });
    return response.data;
  }

  async deleteDepartment(departmentId: number): Promise<ApiResponse> {
    const response = await this.api.delete(`/departments/${departmentId}`, {
      headers: {
        'id': departmentId.toString(),
      }
    });
    return response.data;
  }

  async inviteToDepartment(departmentId: number, teacherId: number): Promise<ApiResponse> {
    const response = await this.api.post(`/admin/department/${departmentId}`, {}, {
      headers: {
        'teacher_id': teacherId.toString(),
      }
    });
    return response.data;
  }

  async kickFromDepartment(departmentId: number, teacherId: number): Promise<ApiResponse> {
    const response = await this.api.delete(`/admin/department/${departmentId}`, {
      headers: {
        'teacher_id': teacherId.toString(),
      }
    });
    return response.data;
  }

  // Enrollment
  async enroll(courseId: number): Promise<ApiResponse> {
    const response = await this.api.post(`/enroll/${courseId}`, {});
    return response.data;
  }

  async unenroll(courseId: number): Promise<ApiResponse> {
    const response = await this.api.delete(`/unenroll/${courseId}`);
    return response.data;
  }

  // Admin
  async getStats(): Promise<Statistics> {
    const response = await this.api.get('/admin/stats');
    return response.data;
  }
}

export const apiService = new ApiService(); 