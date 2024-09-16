import React, { useEffect, useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AssignmentIcon from '@mui/icons-material/Assignment';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Certifique-se de usar `jwtDecode`
import { useNavigate } from 'react-router-dom';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface Project {
  id: number;
  name: string;
}

interface UserPayload {
  sub: number;
  email: string;
}

export function MainListItems() {
  const navigate = useNavigate(); // useNavigate está correto aqui

  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate('/dashboard')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => navigate('/dashboard/projects')}>
        <ListItemIcon>
          <ListAltIcon />
        </ListItemIcon>
        <ListItemText primary="Projetos" />
      </ListItemButton>
    </React.Fragment>
  );
}

export function SecondaryListItems() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null); // Estado para erros
  const navigate = useNavigate(); // useNavigate está correto aqui

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
            Authorization: `Bearer ${token}`
          }
        });

        const projectsData = response.data;

        // Verificar se `projectsData` é um array e se contém os dados esperados
        if (!Array.isArray(projectsData)) {
          throw new Error('Dados de projetos inválidos.');
        }

        // Filtrando apenas os projetos em que o usuário está presente
        const userProjects = projectsData.filter((project: any) =>
          project.users.some((user: any) => user.id === userId)
        );

        // Limitando a exibição a 3 projetos
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

  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Seus Projetos
      </ListSubheader>
      {error && (
        <div style={{ color: 'red', padding: '10px' }}>
          {error}
        </div>
      )}
      {projects.map((project) => (
        <ListItemButton key={project.id} onClick={() => navigate(`/dashboard/kanban/${project.id}`)}>
          <ListItemIcon >
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary={project.name} />
        </ListItemButton>
      ))}
      <ListItemButton onClick={() => navigate('/dashboard/projects')}>
        <MoreHorizOutlinedIcon />
      </ListItemButton>
    </React.Fragment>
  );
}
