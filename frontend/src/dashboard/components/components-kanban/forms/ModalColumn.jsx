import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faHeading,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const ModalColumn = ({
  isColumnModalOpen,
  handleModalColumnClose,
  currentColumn,
  setCurrentColumn,
  handleUpdateColumn,
  newColumnName,
  setNewColumnName,
  handleAddColumn,
  projectColumns,
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = Boolean(currentColumn);

  const onClose = () => {
    handleModalColumnClose();
    if (isEditing) {
      setCurrentColumn(null);
    } else {
      setNewColumnName("");
    }
    setHasError(false);
    setErrorMessage("");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const trimmedName = isEditing
      ? currentColumn.title.trim()
      : newColumnName.trim();

    if (trimmedName === "") {
      setHasError(true);
      setErrorMessage("Este campo é obrigatório");
      return;
    }

    if (!Array.isArray(projectColumns) || projectColumns.length === 0) {
      setHasError(true);
      setErrorMessage("Nenhuma coluna encontrada para o projeto.");
      return;
    }

    const isDuplicate = projectColumns.some(
      (column) =>
        column.title.toLowerCase() === trimmedName.toLowerCase() &&
        (!isEditing || column.id !== currentColumn.id)
    );

    if (isDuplicate) {
      setHasError(true);
      setErrorMessage("Já existe uma coluna com esse nome.");
      return;
    }

    setHasError(false);
    setErrorMessage("");

    if (isEditing) {
      handleUpdateColumn();
    } else {
      handleAddColumn();
    }

    onClose();
  };

  return (
    <Modal open={isColumnModalOpen} onClose={onClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        bgcolor="#F8F9F9"
        borderRadius={2}
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.2)"
        p={4}
        style={{
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "400px",
          minWidth: "300px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          <FontAwesomeIcon icon={faEdit} />{" "}
          {isEditing ? "Editar Coluna" : "Adicionar Coluna"}
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Nome da Coluna"
            value={isEditing ? currentColumn.title : newColumnName}
            onChange={(e) =>
              isEditing
                ? setCurrentColumn({
                    ...currentColumn,
                    title: e.target.value,
                  })
                : setNewColumnName(e.target.value)
            }
            margin="normal"
            variant="outlined"
            error={hasError}
            helperText={hasError ? errorMessage : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faHeading} />
                </InputAdornment>
              ),
            }}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                marginRight: 8,
                fontSize: "1.2rem",
              }}
            >
              <FontAwesomeIcon
                icon={faSave}
                size="lg"
                style={{ marginRight: 4 }}
              />
              <Typography variant="button" component="span" mt={0.2} ml={1}>
                {isEditing ? "Salvar" : "Adicionar"}
              </Typography>
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              style={{
                fontSize: "1.2rem",
              }}
            >
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
        </form>
      </Box>
    </Modal>
  );
};

export default ModalColumn;
