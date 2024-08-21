import api from "../../../axiosInstance";
export const fetchTaskUsers = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data.users.map((user) => user.profileImageUrl); // Ajuste o caminho para obter o URL do avatar
  } catch (error) {
    console.error(`Erro ao buscar usuários para a tarefa ${taskId}:`, error);
    return [];
  }
};

//colocar const restantes aqui
