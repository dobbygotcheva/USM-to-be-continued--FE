import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Course } from '../types';
import { apiService } from '../services/api';

interface StudentDashboardProps {
  selectedView: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ selectedView }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedView === 'courses') {
      loadCourses();
    }
  }, [selectedView]);

  const loadCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const coursesData = await apiService.getCourses();
      setCourses(coursesData);
      
      // Load user's enrollment data to determine which courses they're enrolled in
      const selfData = await apiService.getSelf();
      if (selfData.courses) {
        setEnrolledCourses(selfData.courses);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      await apiService.enroll(courseId);
      // Refresh enrollment data after enrollment
      const selfData = await apiService.getSelf();
      if (selfData.courses) {
        setEnrolledCourses(selfData.courses);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to enroll in course');
    }
  };

  const handleUnenroll = async (courseId: number) => {
    try {
      await apiService.unenroll(courseId);
      // Refresh enrollment data after unenrollment
      const selfData = await apiService.getSelf();
      if (selfData.courses) {
        setEnrolledCourses(selfData.courses);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to unenroll from course');
    }
  };

  const courseColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'course', headerName: 'Course Name', width: 200 },
    { field: 'course_nr', headerName: 'Course Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'cr_cost', headerName: 'Credits', width: 100 },
    { field: 'timeslots', headerName: 'Timeslots', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        const isEnrolled = enrolledCourses.some(course => course.id === params.row.id);
        return (
          <Button
            variant={isEnrolled ? "outlined" : "contained"}
            size="small"
            onClick={() => isEnrolled ? handleUnenroll(params.row.id) : handleEnroll(params.row.id)}
          >
            {isEnrolled ? 'Unenroll' : 'Enroll'}
          </Button>
        );
      },
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
              Student Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Available Courses</Typography>
                    <Typography variant="h4">{courses.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Enrolled Courses</Typography>
                    <Typography variant="h4">{enrolledCourses.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Credits</Typography>
                    <Typography variant="h4">
                      {enrolledCourses.reduce((sum, course) => sum + course.cr_cost, 0)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 'courses':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>
              Available Courses
            </Typography>
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
    </Box>
  );
};

export default StudentDashboard; 