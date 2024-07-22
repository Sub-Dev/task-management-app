import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialData = {
  todo: [
    { id: '1', content: 'Task 1' },
    { id: '2', content: 'Task 2' },
  ],
  inProgress: [
    { id: '3', content: 'Task 3' },
  ],
  done: [
    { id: '4', content: 'Task 4' },
  ],
};

const Kanban = () => {
  const [data, setData] = React.useState(initialData);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const item = data[sourceColumn][source.index];

    // If moving to the same column
    if (sourceColumn === destColumn) {
      const newColumn = Array.from(data[sourceColumn]);
      newColumn.splice(source.index, 1);
      newColumn.splice(destination.index, 0, item);

      setData({
        ...data,
        [sourceColumn]: newColumn,
      });
    } else {
      const sourceColumnItems = Array.from(data[sourceColumn]);
      const destColumnItems = Array.from(data[destColumn]);

      sourceColumnItems.splice(source.index, 1);
      destColumnItems.splice(destination.index, 0, item);

      setData({
        ...data,
        [sourceColumn]: sourceColumnItems,
        [destColumn]: destColumnItems,
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(data).map((column) => (
            <Droppable droppableId={column} key={column}>
              {(provided) => (
                <Paper
                  sx={{ width: 300, minHeight: '100vh', p: 2, m: 1 }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Typography variant="h6" gutterBottom>
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </Typography>
                  {data[column].map((item, index) => (
                    <Draggable draggableId={item.id} index={index} key={item.id}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ p: 2, mb: 1 }}
                        >
                          {item.content}
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>
    </Container>
  );
};

export default Kanban;
