import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { User, Course, Department, Statistics } from '../types';
import { apiService } from '../services/api';

interface AdminDashboardProps {
  selectedView: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ selectedView }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState<any>({});
  const [editUser, setEditUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, type: string, id: number, name: string}>({
    open: false, type: '', id: 0, name: ''
  });

  useEffect(() => {
    loadData();
  }, [selectedView]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Always load teachers for course creation form
      const teachersData = await apiService.getTeachers();
      setTeachers(teachersData);
      
      switch (selectedView) {
        case 'users':
          const usersData = await apiService.getUsers();
          setUsers(usersData);
          break;
        case 'students':
          const studentsData = await apiService.getStudents();
          setStudents(studentsData);
          break;
        case 'teachers':
          // Teachers already loaded above
          break;
        case 'courses':
          const coursesData = await apiService.getCourses();
          setCourses(coursesData);
          break;
        case 'departments':
          const departmentsData = await apiService.getDepartments();
          setDepartments(departmentsData);
          break;
        case 'stats':
          const statsData = await apiService.getStats();
          setStats(statsData);
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (type: string) => {
    setDialogType(type);
    setFormData({});
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      switch (dialogType) {
        case 'department':
          if (!formData.name) {
            setError('Department name is required');
            return;
          }
          await apiService.createDepartment(formData);
          break;
        case 'course':
          if (!formData.teacher_id) {
            setError('Please select a teacher for this course');
            return;
          }
          if (!formData.course || !formData.course_nr || !formData.description || !formData.cr_cost || !formData.timeslots) {
            setError('All course fields are required');
            return;
          }
          await apiService.createCourse(formData);
          break;
      }
      setOpenDialog(false);
      setError(''); // Clear any previous errors
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create item');
    }
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setOpenEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    
    try {
      await apiService.updateUser(editUser.id, {
        username: editUser.username,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
      });
      setOpenEditDialog(false);
      setEditUser(null);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDelete = (type: string, id: number, name: string) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const confirmDelete = async () => {
    try {
      switch (deleteDialog.type) {
        case 'user':
          await apiService.deleteUser(deleteDialog.id);
          break;
        case 'course':
          await apiService.deleteCourse(deleteDialog.id);
          break;
        case 'department':
          await apiService.deleteDepartment(deleteDialog.id);
          break;
      }
      setDeleteDialog({ open: false, type: '', id: 0, name: '' });
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete item');
    }
  };

  const userColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'role', headerName: 'Role', width: 100 },
    { field: 'verified', headerName: 'Verified', width: 100, type: 'boolean' },
    { field: 'suspended', headerName: 'Suspended', width: 100, type: 'boolean' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit User">
            <IconButton
              onClick={() => handleEditUser(params.row)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              onClick={() => handleDelete('user', params.row.id, params.row.username)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const courseColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'course', headerName: 'Course Name', width: 200 },
    { field: 'course_nr', headerName: 'Course Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'cr_cost', headerName: 'Credits', width: 80 },
    { field: 'timeslots', headerName: 'Timeslots', width: 120 },
    { 
      field: 'teacher_name', 
      headerName: 'Teacher', 
      width: 150,
      valueGetter: (params) => {
        const teacher = teachers.find(t => t.id === params.row.teacher_id);
        return teacher ? teacher.username : 'Unknown';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Delete Course">
          <IconButton
            onClick={() => handleDelete('course', params.row.id, params.row.course)}
            size="small"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const departmentColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Department Name', width: 250 },
    { 
      field: 'teacher_count', 
      headerName: 'Teachers', 
      width: 100,
      valueGetter: (params) => {
        // Count teachers in this department
        const deptTeachers = teachers.filter(t => {
          // This would need to be enhanced when we have teacher-department relationships
          return true; // For now, just show total teachers
        });
        return deptTeachers.length;
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Delete Department">
          <IconButton
            onClick={() => handleDelete('department', params.row.id, params.row.name)}
            size="small"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    switch (selectedView) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Users</Typography>
                    <Typography variant="h4">{users.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {students.length} Students • {teachers.length} Teachers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Courses</Typography>
                    <Typography variant="h4">{courses.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Active courses in system
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Departments</Typography>
                    <Typography variant="h4">{departments.length}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Academic departments
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">System Status</Typography>
                    <Typography variant="h4" color="success.main">✓ Active</Typography>
                    <Typography variant="body2" color="textSecondary">
                      All systems operational
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Recent Activity */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Recent Activity
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Recent Courses</Typography>
                      {courses.slice(0, 3).map((course) => (
                        <Box key={course.id} sx={{ py: 1 }}>
                          <Typography variant="body2">
                            <strong>{course.course}</strong> ({course.course_nr})
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Teacher: {teachers.find(t => t.id === course.teacher_id)?.username || 'Unknown'}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Recent Users</Typography>
                      {users.slice(0, 3).map((user) => (
                        <Box key={user.id} sx={{ py: 1 }}>
                          <Typography variant="body2">
                            <strong>{user.username}</strong> ({user.role})
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 'users':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              All Users
            </Typography>
            <DataGrid
              rows={users}
              columns={userColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        );

      case 'students':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Students
            </Typography>
            <DataGrid
              rows={students}
              columns={userColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        );

      case 'teachers':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Teachers
            </Typography>
            <DataGrid
              rows={teachers}
              columns={userColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        );

      case 'courses':
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4">Courses</Typography>
              <Button
                variant="contained"
                onClick={() => handleCreate('course')}
              >
                Add Course
              </Button>
            </Box>
            <DataGrid
              rows={courses}
              columns={courseColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        );

      case 'departments':
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4">Departments</Typography>
              <Button
                variant="contained"
                onClick={() => handleCreate('department')}
              >
                Add Department
              </Button>
            </Box>
            <DataGrid
              rows={departments}
              columns={departmentColumns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
              autoHeight
            />
          </Box>
        );

      case 'stats':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              System Statistics
            </Typography>
            {stats ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">User Statistics</Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                          <strong>Total Users:</strong> {stats.registered_users}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Active Students:</strong> {stats.active_students}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Faculty Members:</strong> {stats.faculty_members}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Graduated Students:</strong> {stats.graduated_students}
                        </Typography>
                        <Typography variant="body1" color="error">
                          <strong>Suspended Users:</strong> {stats.suspended_users}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">Academic Statistics</Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                          <strong>Total Courses:</strong> {stats.courses}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Departments:</strong> {stats.departments}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Student-Teacher Ratio:</strong> {
                            stats.faculty_members > 0 
                              ? (stats.active_students / stats.faculty_members).toFixed(1) 
                              : 'N/A'
                          }
                        </Typography>
                        <Typography variant="body1">
                          <strong>Graduation Rate:</strong> {
                            stats.active_students > 0 
                              ? ((stats.graduated_students / (stats.active_students + stats.graduated_students)) * 100).toFixed(1) + '%'
                              : '0%'
                          }
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary">System Health</Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" color="success.main">
                          <strong>System Status:</strong> ✓ Operational
                        </Typography>
                        <Typography variant="body1">
                          <strong>Database Records:</strong> {stats.registered_users + stats.courses + stats.departments}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Active Sessions:</strong> {stats.registered_users > 0 ? 'Active' : 'None'}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Last Updated:</strong> {new Date().toLocaleString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Charts and Visualizations */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        User Distribution
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                            <Typography variant="h4" color="white">{stats.active_students}</Typography>
                            <Typography variant="body2" color="white">Active Students</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}>
                            <Typography variant="h4" color="white">{stats.faculty_members}</Typography>
                            <Typography variant="body2" color="white">Faculty Members</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                            <Typography variant="h4" color="white">{stats.graduated_students}</Typography>
                            <Typography variant="body2" color="white">Graduated Students</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                            <Typography variant="h4" color="white">{stats.suspended_users}</Typography>
                            <Typography variant="body2" color="white">Suspended Users</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            )}
          </Box>
        );

      default:
        return <Typography>Select a view from the sidebar</Typography>;
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {renderContent()}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'department' ? 'Add Department' : 'Add Course'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'department' && (
            <TextField
              fullWidth
              label="Department Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
            />
          )}
          {dialogType === 'course' && (
            <Box>
              <FormControl fullWidth margin="normal">
                <InputLabel>Teacher</InputLabel>
                <Select
                  value={formData.teacher_id || ''}
                  onChange={(e) => setFormData({ ...formData, teacher_id: parseInt(e.target.value) })}
                  label="Teacher"
                >
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.username} ({teacher.email})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No teachers available</MenuItem>
                  )}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Course Name"
                value={formData.course || ''}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Course Number"
                value={formData.course_nr || ''}
                onChange={(e) => setFormData({ ...formData, course_nr: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Credits"
                type="number"
                value={formData.cr_cost || ''}
                onChange={(e) => setFormData({ ...formData, cr_cost: parseInt(e.target.value) })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Timeslots"
                value={formData.timeslots || ''}
                onChange={(e) => setFormData({ ...formData, timeslots: e.target.value })}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <Box>
              <TextField
                fullWidth
                label="Username"
                value={editUser.username || ''}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={editUser.email || ''}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone"
                value={editUser.phone || ''}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={editUser.role || 'student'}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, type: '', id: 0, name: '' })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteDialog.type}?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {deleteDialog.name}
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. Related data may also be affected.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', id: 0, name: '' })}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 