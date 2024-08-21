import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faHeading,
  faAlignLeft,
  faCalendar,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import api from "../../../axiosInstance";

const TaskEditModal = ({
  isModalOpen,
  handleModalClose,
  currentTask,
  setCurrentTask,
  projectId,
  handleTaskUpdate,
}) => {
  const [users, setUsers] = useState([]);

  // Carrega os usuários do projeto ao abrir o modal
  useEffect(() => {
    if (isModalOpen) {
      const fetchUsers = async () => {
        try {
          const response = await api.get(`/projects/${projectId}`);
          setUsers(response.data.users); // Supondo que os usuários estão em response.data.users
        } catch (error) {
          console.error("Erro ao carregar usuários:", error);
        }
      };

      fetchUsers();
    }
  }, [isModalOpen, projectId]);

  // Função para atualizar a seleção de usuários
  const handleUserChange = (event) => {
    const selectedUserIds = event.target.value;
    setCurrentTask({
      ...currentTask,
      users: selectedUserIds.map((userId) =>
        users.find((user) => user.id === userId)
      ),
    });
  };

  return (
    <Modal open={isModalOpen} onClose={handleModalClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        bgcolor="#f7f7f7"
        borderRadius={2}
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
        p={4}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <Typography variant="h4" gutterBottom>
          <FontAwesomeIcon icon={faEdit} /> Edição de Tarefa
        </Typography>
        {currentTask && (
          <>
            <TextField
              fullWidth
              label="Título da Tarefa"
              value={currentTask.title}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, title: e.target.value })
              }
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faHeading} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Descrição"
              value={currentTask.description}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, description: e.target.value })
              }
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faAlignLeft} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Data de vencimento"
              type="date"
              value={moment(currentTask.due_date).format("YYYY-MM-DD")}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, due_date: e.target.value })
              }
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faCalendar} />
                  </InputAdornment>
                ),
              }}
            />
            <Box mt={2}>
              <Typography variant="h6">Participantes</Typography>
              <Select
                multiple
                value={
                  currentTask?.users
                    ? currentTask.users.map((user) => user.id)
                    : []
                }
                onChange={handleUserChange}
                renderValue={(selected) =>
                  selected
                    .map((id) => users.find((user) => user.id === id)?.username)
                    .join(", ")
                }
                margin="normal"
                variant="outlined"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox
                      checked={
                        currentTask?.users
                          ? currentTask.users.some((u) => u.id === user.id)
                          : false
                      }
                    />
                    <ListItemText primary={user.username} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleTaskUpdate}
                style={{ marginRight: 8 }}
              >
                <FontAwesomeIcon
                  icon={faSave}
                  size="lg"
                  style={{ marginRight: 4 }}
                />
                <Typography variant="button" component="span" mt={0.2} ml={1}>
                  Salvar
                </Typography>
              </Button>
              <Button variant="outlined" onClick={handleModalClose}>
                <FontAwesomeIcon
                  icon={faTimes}
                  size="lg"
                  style={{ marginRight: 4 }}
                />
                <Typography variant="button" component="span" mt={0.2} ml={1}>
                  Cancelar
                </Typography>
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default TaskEditModal;
