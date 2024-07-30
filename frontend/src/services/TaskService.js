// src/services/TaskService.js

import axios from 'axios';

const API_URL = 'http://localhost:4000/tasks'; // Ajuste o URL conforme sua configuração

export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_URL}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
};

export const getAllTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_URL}/${taskId}`);
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
};
