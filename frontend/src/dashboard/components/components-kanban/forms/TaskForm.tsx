import React from 'react';
import { Card, CardContent, TextField, Button } from '@mui/material';

const TaskForm = ({
  columnId,
  newTaskTitles,
  setNewTaskTitles,
  newTaskDescriptions,
  setNewTaskDescriptions,
  newTaskDueDates,
  setNewTaskDueDates,
  handleAddTask
}) => {
  return (
    <Card>
      <CardContent>
        <TextField
          fullWidth
          label="Título da Tarefa"
          value={newTaskTitles[columnId] || ''}
          onChange={(e) =>
            setNewTaskTitles({ ...newTaskTitles, [columnId]: e.target.value })
          }
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Descrição da Tarefa"
          value={newTaskDescriptions[columnId] || ''}
          onChange={(e) =>
            setNewTaskDescriptions({
              ...newTaskDescriptions,
              [columnId]: e.target.value,
            })
          }
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Data de Vencimento"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newTaskDueDates[columnId] || ''}
          onChange={(e) =>
            setNewTaskDueDates({
              ...newTaskDueDates,
              [columnId]: e.target.value,
            })
          }
          margin="normal"
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddTask(columnId)}
          style={{ marginTop: 8 }}
        >
          Adicionar Tarefa
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
