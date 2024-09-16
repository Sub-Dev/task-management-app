// DialogDelete.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface DialogDeleteProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemType: 'column' | 'task';

}

const DialogDelete: React.FC<DialogDeleteProps> = ({
  open,
  onClose,
  onDelete,
  itemType,
}) => {
  const title = itemType === 'column' ? 'Excluir Coluna' : 'Excluir Tarefa';
  const message = itemType === 'column' ? `Você tem certeza que deseja excluir a coluna ?` : `Você tem certeza que deseja excluir a tarefa ?`;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onDelete} color="primary">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDelete;