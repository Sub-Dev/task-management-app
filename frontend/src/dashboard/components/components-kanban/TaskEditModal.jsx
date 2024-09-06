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
  const [projectUsers, setProjectUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (isModalOpen && currentTask) {
        setLoading(true);
        try {
          const taskResponse = await api.get(`/tasks/${currentTask.id}`);
          const taskData = taskResponse.data;

          setCurrentTask((prevTask) => ({
            ...prevTask,
            ...taskData,
          }));

          const projectId = taskData.project.id;
          const projectResponse = await api.get(`/projects/${projectId}`);
          const projectData = projectResponse.data;

          setProjectUsers(projectData.users);
        } catch (error) {
          setError(
            "Erro ao carregar os detalhes da tarefa ou usuários do projeto."
          );
          console.error(
            "Erro ao carregar os detalhes da tarefa ou usuários do projeto:",
            error
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTaskDetails();
  }, [isModalOpen, currentTask?.id]);

  const handleUserChange = (event) => {
    const selectedUserIds = event.target.value;
    setCurrentTask((prevTask) => ({
      ...prevTask,
      users: projectUsers.filter((user) => selectedUserIds.includes(user.id)),
    }));
  };

  const handleModalCloseInternal = () => {
    setCurrentTask(null); // Limpa o estado ao fechar o modal
    handleModalClose(); // Chama a função de fechamento do modal
  };

  const validateForm = () => {
    const errors = {
      title: "",
      description: "",
      due_date: "",
    };
    let isValid = true;

    if (!currentTask.title) {
      errors.title = "Título é obrigatório.";
      isValid = false;
    }
    if (!currentTask.description) {
      errors.description = "Descrição é obrigatória.";
      isValid = false;
    }
    if (!currentTask.due_date) {
      errors.due_date = "Data de vencimento é obrigatória.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      handleTaskUpdate();
      handleModalCloseInternal();
    }
  };

  return (
    <Modal open={isModalOpen} onClose={handleModalCloseInternal}>
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
        {loading && <Typography>Carregando...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
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
              error={!!formErrors.title}
              helperText={formErrors.title}
              sx={{ mb: 2 }}
              style={{ borderColor: formErrors.title ? "red" : "inherit" }}
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
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{ mb: 2 }}
              style={{
                borderColor: formErrors.description ? "red" : "inherit",
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
              error={!!formErrors.due_date}
              helperText={formErrors.due_date}
              sx={{ mb: 2 }}
              style={{ borderColor: formErrors.due_date ? "red" : "inherit" }}
            />

            <Box mt={2}>
              <Typography variant="h6">Participantes</Typography>
              <Select
                multiple
                value={
                  currentTask?.users
                    ? currentTask.users
                        .map((user) => user.id)
                        .filter((id) =>
                          projectUsers.some((user) => user.id === id)
                        )
                    : []
                }
                onChange={handleUserChange}
                renderValue={(selected) =>
                  selected
                    .map(
                      (id) =>
                        projectUsers.find((user) => user.id === id)?.username
                    )
                    .join(", ")
                }
                margin="none"
                variant="outlined"
              >
                {projectUsers.map((user) => (
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
                onClick={handleSave}
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
              <Button variant="outlined" onClick={handleModalCloseInternal}>
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
