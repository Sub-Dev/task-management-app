import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CloseIcon from '@mui/icons-material/Close';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';
import DashboardImagem from '../../img/dashboard.png';
import KanbanImagem from '../../img/kanban.png';
import ProjectImagem from '../../img/projects.png';

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Painel de Controle',
    description:
      'Oferece uma visão geral das métricas e dados mais importantes relacionados ao produto.',
    image: DashboardImagem,
  },
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Utilização de Kanban nos Projetos',
    description:
      'Acompanhe e gerencie o progresso dos projetos usando o sistema Kanban integrado.',
    image: KanbanImagem,
  },
  {
    icon: <DevicesRoundedIcon />,
    title: 'Lista de Projetos',
    description:
      'Visualize e gerencie todos os seus projetos em uma lista detalhada.',
    image: ProjectImagem,
  },
];

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container
      id="features"
      sx={{
        py: { xs: 8, sm: 16 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Grid
        container
        spacing={6}
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: 'center' }}
      >
        <Grid item xs={12} md={6}>
          <div>
            <Typography component="h2" variant="h4" color="text.primary" >
              Funcionalidades do Projeto
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: { xs: 2, sm: 4 } }}
            >
              Aqui você pode ver uma visão geral das principais funcionalidades do projeto.
            </Typography>
          </div>
          <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }}>
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                sx={{
                  backgroundColor: selectedItemIndex === index ? 'primary.main' : '',
                  '& .MuiChip-label': {
                    color: selectedItemIndex === index ? '#fff' : '',
                  },
                }}
              />
            ))}
          </Grid>
          <Box
            component={Card}
            variant="outlined"
            onClick={handleOpenModal}
            sx={{
              display: { xs: 'auto', sm: 'auto' },
              mt: 4,
              position: 'relative',
              overflow: 'hidden',
              height: 280,
              backgroundImage: `url(${selectedFeature.image})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Box
              sx={{
                px: 2,
                pb: 2,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <Typography color="text.primary" variant="body2" fontWeight="bold">
                {selectedFeature.title}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
                {selectedFeature.description}
              </Typography>
              <Link
                color="primary"
                variant="body2"
                fontWeight="bold"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  '& > svg': { transition: '0.2s' },
                  '&:hover > svg': { transform: 'translateX(2px)' },
                }}
              >
                <span>Saiba mais</span>
                <ChevronRightRoundedIcon
                  fontSize="small"
                  sx={{ mt: '1px', ml: '2px' }}
                />
              </Link>
            </Box>
          </Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Card
                key={index}
                variant="outlined"
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={{
                  p: 3,
                  width: '100%',
                  backgroundColor:
                    selectedItemIndex === index ? 'action.selected' : undefined,
                }}
              >
                <Box sx={{ display: 'flex', textAlign: 'left', gap: 2.5 }}>
                  <Box>{icon}</Box>
                  <Box sx={{ textTransform: 'none' }}>
                    <Typography
                      color="text.primary"
                      variant="body2"
                      fontWeight="bold"
                    >
                      {title}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
                      {description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Modal Image Preview */}
        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogContent sx={{ position: 'relative', padding: 0 }}>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={selectedFeature.image}
              alt={selectedFeature.title}
              sx={{ width: '100%', height: 'auto' }}
            />
          </DialogContent>
        </Dialog>
      </Grid>
    </Container>
  );
}
