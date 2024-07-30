// src/services/columnService.js

import axios from 'axios';

const API_URL = 'http://localhost:4000/columns'; // URL da API de colunas

export const createColumn = async (title, projectId) => {
  try {
    const response = await axios.post(API_URL, { title, projectId });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar coluna:', error);
  }
};

export const getAllColumns = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter colunas:', error);
  }
};

export const updateColumn = async (id, title) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { title });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar coluna:', error);
  }
};

export const deleteColumn = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao deletar coluna:', error);
  }
};
