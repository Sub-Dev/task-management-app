import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { Work, Task, Done, HourglassEmpty } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../context/SnackbarContext.tsx';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HomeDashboard = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [dashboardData, setDashboardData] = useState({
    projectCount: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalTasks: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Erro: Token JWT não encontrado.');
          navigate('/signin');
          return;
        }

        const decoded = jwtDecode<any>(token);
        const userId = decoded.sub;

        const projectsResponse = await axios.get('http://localhost:4000/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const projects = projectsResponse.data;

        const userProjects = projects.filter((project: any) =>
          project.users.some((user: any) => user.id === userId)
        );

        let totalCompletedTasks = 0;
        let totalPendingTasks = 0;

        userProjects.forEach((project: any) => {
          const completed = project.tasks.filter((task: any) => task.status === 'completed').length;
          const pending = project.tasks.filter((task: any) => task.status === 'pending').length;

          totalCompletedTasks += completed;
          totalPendingTasks += pending;
        });

        setDashboardData({
          projectCount: userProjects.length,
          completedTasks: totalCompletedTasks,
          pendingTasks: totalPendingTasks,
          totalTasks: totalCompletedTasks + totalPendingTasks,
        });
      } catch (error) {
        console.error('Erro ao buscar dados do backend:', error);
        showSnackbar('Erro ao buscar dados do backend. Por favor, tente novamente.', 'error');
        navigate('/signin');
      }
    };

    fetchData();
  }, [navigate, showSnackbar]);

  const { projectCount, completedTasks, pendingTasks, totalTasks } = dashboardData;

  const data = [
    {
      title: 'Projetos',
      value: projectCount,
      icon: <Work sx={{ fontSize: 30, color: '#3f51b5' }} />,
      color: '#e3f2fd',
    },
    {
      title: 'Tarefas Concluídas',
      value: completedTasks,
      icon: <Done sx={{ fontSize: 30, color: '#4caf50' }} />,
      color: '#e8f5e9',
    },
    {
      title: 'Tarefas Pendentes',
      value: pendingTasks,
      icon: <Task sx={{ fontSize: 30, color: '#ff9800' }} />,
      color: '#fff3e0',
    },
    {
      title: 'Total de Tarefas',
      value: totalTasks,
      icon: <HourglassEmpty sx={{ fontSize: 30, color: '#f44336' }} />,
      color: '#ffebee',
    },
  ];

  const chartData = {
    labels: ['Tarefas Concluídas', 'Tarefas Pendentes'],
    datasets: [
      {
        label: 'Número de Tarefas',
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#4caf50', '#ff9800'],
        borderColor: ['#388e3c', '#f57c00'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ backgroundColor: item.color, minHeight: 130 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                  <Box sx={{ marginRight: 2 }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="h4">{item.value}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ marginTop: 4 }}>
        <Card sx={{ backgroundColor: '#ECF0F1', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 2, color: '#2C3E50' }}>
              Distribuição das Tarefas
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top', labels: { color: '#2C3E50' } },
                    tooltip: { callbacks: { label: (tooltipItem) => `Número de Tarefas: ${tooltipItem.raw}` } },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default HomeDashboard;
