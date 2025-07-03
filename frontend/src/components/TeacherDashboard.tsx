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

interface TeacherDashboardProps {
  selectedView: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ selectedView }) => {
  const [courses, setCourses] = useState<Course[]>([]);
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
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const courseColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'course', headerName: 'Course Name', width: 200 },
    { field: 'course_nr', headerName: 'Course Number', width: 150 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'cr_cost', headerName: 'Credits', width: 100 },
    { field: 'timeslots', headerName: 'Timeslots', width: 150 },
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
              Teacher Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">My Courses</Typography>
                    <Typography variant="h4">{courses.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Students</Typography>
                    <Typography variant="h4">-</Typography>
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
              My Courses
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

export default TeacherDashboard; 