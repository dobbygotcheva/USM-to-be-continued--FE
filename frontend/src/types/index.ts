export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  verified: boolean;
  suspended: boolean;
  forcenewpw: boolean;
  role: string;
}

export interface StudentAccount {
  id: number;
  student_id: number;
  advisor_id: number;
  discipline: string;
  enrollment: string;
  cgpa: number;
  can_grad: boolean;
  cur_credit: number;
  cum_credit: number;
}

export interface TeacherAccount {
  id: number;
  teacher_id: number;
  dept_id: number;
}

export interface Course {
  id: number;
  teacher_id: number;
  course: string;
  course_nr: string;
  description: string;
  cr_cost: number;
  timeslots: string;
}

export interface StudentCourse {
  student_id: number;
  course_id: number;
  grade: number;
  semester: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface LoginCredentials {
  login_email: string;
  login_password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  phone?: string;
}

export interface CourseFormData {
  teacher_id: number;
  course: string;
  course_nr: string;
  description: string;
  cr_cost: number;
  timeslots: string;
}

export interface DepartmentFormData {
  name: string;
}

export interface Statistics {
  registered_users: number;
  suspended_users: number;
  faculty_members: number;
  active_students: number;
  graduated_students: number;
  courses: number;
  departments: number;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
} 