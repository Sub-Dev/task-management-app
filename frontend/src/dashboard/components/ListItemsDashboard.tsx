import React, { useEffect, useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Box from '@mui/material/Box';
import { useProjectContext } from '../../context/ProjectContext.tsx';


interface Project {
  id: number;
  name: string;
}

interface UserPayload {
  sub: number;
  email: string;
}
interface ListItemsProps {
  open: boolean;
}
export function MainListItems({ open }: ListItemsProps) {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Tooltip
        title={!open ? "Dashboard" : ""}
        arrow
        placement="right"
      >
        <ListItemButton onClick={() => navigate('/dashboard')}>
          <ListItemIcon sx={{ color: '#3498DB', minWidth: 30 }}>
            <DashboardIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{ sx: { color: 'white', fontSize: 13, marginLeft: '8px' } }}
            />
          )}
        </ListItemButton>
      </Tooltip>

      <Tooltip
        title={!open ? "Projetos" : ""}
        arrow
        placement="right"
      >
        <ListItemButton onClick={() => navigate('/dashboard/projects')}>
          <ListItemIcon sx={{ color: '#3498DB', minWidth: 30 }}>
            <ListAltIcon />
          </ListItemIcon>
          {open && (
            <ListItemText
              primary="Projetos"
              primaryTypographyProps={{ sx: { color: 'white', fontSize: 13, marginLeft: '8px' } }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </React.Fragment>
  );
}

export function SecondaryListItems({ open }: ListItemsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { selectedProject } = useProjectContext();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Erro: Token JWT não encontrado.');
          setError('Você precisa estar logado para ver seus projetos.');
          navigate('/signin');
          return;
        }

        const decoded = jwtDecode<UserPayload>(token);
        const userId = decoded.sub;

        const response = await axios.get('http://localhost:4000/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const projectsData = response.data;


        if (!Array.isArray(projectsData)) {
          throw new Error('Dados de projetos inválidos.');
        }


        const userProjects = projectsData.filter((project: any) =>
          project.users.some((user: any) => user.id === userId)
        );


        const limitedProjects = userProjects.slice(0, 3);

        setProjects(limitedProjects);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        setError('Não foi possível carregar seus projetos.');
        if (error.response && error.response.status === 401) {
          navigate('/signin');
        }
      }
    };

    fetchProjects();
  }, [navigate]);


  useEffect(() => {
    if (selectedProject) {

      const updatedProjects = projects.map((project) => {
        if (project.id === selectedProject.id) {
          return { ...project, name: selectedProject.name };
        }
        return project;
      });

      setProjects(updatedProjects);
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      {open ? (
        <ListSubheader
          component="div"
          inset
          sx={{
            backgroundColor: '#2C3E50',
            color: 'white',
            textAlign: 'left',
            fontWeight: 'bold',
          }}
        >
          Seus Projetos
        </ListSubheader>
      ) : (
        <Box sx={{ height: 48 }} />
      )}
      {error && (
        <div style={{ color: 'red', padding: '10px' }}>
          {error}
        </div>
      )}
      {projects.map((project) => (
        <Tooltip title={open ? '' : project.name} key={project.id} placement="right" disableInteractive>
          <ListItemButton onClick={() => navigate(`/dashboard/kanban/${project.id}`)}>
            <ListItemIcon sx={{ color: '#3498DB', minWidth: 30 }} >
              <AssignmentIcon />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary={project.name}
                primaryTypographyProps={{ sx: { color: 'white', fontSize: 13, marginLeft: '8px' } }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      ))}
      <Tooltip
        title={open ? 'Mais Projetos' : 'Mais Projetos'}
        placement={open ? 'bottom' : 'right'}
        disableInteractive
      >
        <ListItemButton
          sx={{
            color: '#3498DB',
            marginTop: '16px',
          }}
          onClick={() => navigate('/dashboard/projects')}
        >
          <ListItemIcon sx={{ minWidth: 30, color: '#3498DB' }}>
            <MoreHorizOutlinedIcon />
          </ListItemIcon>
          {open ? (
            <Typography variant="body2" sx={{ color: 'white', marginLeft: '1%', fontWeight: 'bold' }}>
              Mais Projetos
            </Typography>
          ) : null}
        </ListItemButton>
      </Tooltip>
    </React.Fragment>
  );
}
