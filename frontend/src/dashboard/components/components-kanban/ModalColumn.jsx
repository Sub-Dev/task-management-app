import React from 'react';
import { Modal, Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHeading, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const ModalColumn = ({
  isColumnModalOpen,
  handleModalColumnClose,
  currentColumn,
  setCurrentColumn,
  handleUpdateColumn,
  newColumnName,
  setNewColumnName,
  handleAddColumn
}) => {
  // Determina se o modal está em modo de edição ou adição
  const isEditing = Boolean(currentColumn);

  // Função para lidar com o fechamento do modal
  const onClose = () => {
    handleModalColumnClose();
    if (isEditing) {
      setCurrentColumn(null); // Limpa o estado da coluna atual após a edição
    } else {
      setNewColumnName(''); // Limpa o nome da nova coluna após adicionar
    }
  };

  // Função para lidar com o envio do formulário
  const onSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdateColumn(); // Chama a função de atualização da coluna
    } else {
      handleAddColumn(); // Chama a função de adicionar nova coluna
    }
    onClose(); // Fecha o modal após a ação
  };

  return (
    <Modal open={isColumnModalOpen} onClose={onClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        bgcolor="#f7f7f7"
        borderRadius={2}
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
        p={4}
        style={{ transform: 'translate(-50%, -50%)', width: '400px' }}
      >
        <Typography variant="h4" gutterBottom>
          <FontAwesomeIcon icon={faEdit} /> {isEditing ? 'Editar Coluna' : 'Adicionar Coluna'}
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Nome da Coluna"
            value={isEditing ? currentColumn.title : newColumnName}
            onChange={(e) =>
              isEditing
                ? setCurrentColumn({ ...currentColumn, title: e.target.value })
                : setNewColumnName(e.target.value) // Atualiza o nome da nova coluna
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
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              type="submit" // Muda para tipo submit para chamar onSubmit
              variant="contained"
              color="primary"
              style={{
                marginRight: 8,
                fontSize: '1.2rem',
              }}
            >
              <FontAwesomeIcon
                icon={faSave}
                size="lg"
                style={{ marginRight: 4 }}
              />
              <Typography variant="button" component="span" mt={0.2} ml={1}>
                {isEditing ? 'Salvar' : 'Adicionar'}
              </Typography>
            </Button>

            <Button
              type="button" // Muda para tipo button para não submeter o formulário
              variant="outlined"
              onClick={onClose}
              style={{
                fontSize: '1.2rem',
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
