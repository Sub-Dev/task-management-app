// KanbanHeader.js

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const KanbanHeader = ({ project, setIsColumnModalOpen }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      mb={2}
      sx={{
        backgroundColor: '#ECF0F1',
        padding: 2,
        borderRadius: 1,
        backdropFilter: 'blur(5px)',
      }}
    >
      <Typography variant="h4" component="h1" color='#2C3E50'>
        {project ? project.name : 'Kanban Board'}
      </Typography>
      <Box ml="auto">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsColumnModalOpen(true)}
        >
          Add Column
        </Button>
      </Box>
    </Box>
  );
};

export default KanbanHeader;
