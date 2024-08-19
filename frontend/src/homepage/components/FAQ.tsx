import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

export default function FAQ() {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const theme = useTheme(); // Hook para acessar o tema atual

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
        bgcolor: theme.palette.mode === 'dark' ? '#1b222a' : '#f5f5f5', // Adapta a cor de fundo com base no tema
        color: theme.palette.text.primary,
      }}
    >
      <Typography
        component="h2"
        variant="h4"
        color="text.primary"
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
          fontWeight: 'bold',
        }}
      >
        Perguntas Frequentes
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
          sx={{
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? '#2c2f36' : '#e0e0e0', // Adapta a cor de fundo com base no tema
            border: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`, // Adapta a cor da borda com base no tema
            mb: 1,
            '&:before': {
              display: 'none',
            },
            '& .MuiAccordionSummary-root': {
              borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`, // Adapta a cor da borda com base no tema
              backgroundColor: theme.palette.mode === 'dark' ? '#1b222a' : '#ffffff', // Adapta a cor de fundo com base no tema
            },
            '& .MuiAccordionDetails-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1b222a' : '#ffffff', // Adapta a cor de fundo com base no tema
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="h3" variant="subtitle2" color="text.primary">
              Como posso obter suporte técnico se encontrar problemas com o aplicativo?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Se você encontrar problemas ou tiver dúvidas sobre o funcionamento do aplicativo, entre em contato através do e-mail <Link href="mailto:bilomarin@gmail.com" color="inherit">bilomarin@gmail.com</Link>. Estou à disposição para ajudar com qualquer questão que você possa ter.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
          sx={{
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? '#2c2f36' : '#e0e0e0', // Adapta a cor de fundo com base no tema
            border: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`, // Adapta a cor da borda com base no tema
            mb: 1,
            '&:before': {
              display: 'none',
            },
            '& .MuiAccordionSummary-root': {
              borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`, // Adapta a cor da borda com base no tema
              backgroundColor: theme.palette.mode === 'dark' ? '#1b222a' : '#ffffff', // Adapta a cor de fundo com base no tema
            },
            '& .MuiAccordionDetails-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1b222a' : '#ffffff', // Adapta a cor de fundo com base no tema
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="h3" variant="subtitle2" color="text.primary">
              O aplicativo possui uma política de devolução?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Como este aplicativo é destinado exclusivamente para demonstração de habilidades e não está à venda, não oferecemos uma política de devolução. No entanto, estou disponível para discutir qualquer feedback ou sugestão que você tenha.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
          sx={{
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? '#2c2f36' : '#e0e0e0', // Adapta a cor de fundo com base no tema
            border: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`, // Adapta a cor da borda com base no tema
            mb: 1,
            '&:before': {
              display: 'none',
            },
            '& .MuiAccordionSummary-root': {
              borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`, // Adapta a cor da borda com base no tema
              backgroundColor: theme.palette.mode === 'dark' ? '#1b222a' : '#ffffff', // Adapta a cor de fundo com base no tema
            },
            '& .MuiAccordionDetails-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1b222a' : '#ffffff', // Adapta a cor de fundo com base no tema
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="h3" variant="subtitle2" color="text.primary">
              O que diferencia este aplicativo de outros projetos similares?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Este aplicativo foi desenvolvido para demonstrar habilidades técnicas e boas práticas de desenvolvimento web. Ele se destaca pela sua implementação eficiente de um Kanban board, boas práticas de design, e integração de tecnologias modernas, como React, NestJS, PostgreSQL e Docker.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleChange('panel4')}
          sx={{
            borderRadius: '8px',
            backgroundColor: theme.palette.mode === 'dark' ? '#2c2f36' : '#e0e0e0', // Adapta a cor de fundo com base no tema
            border: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`, // Adapta a cor da borda com base no tema
            mb: 1,
            '&:before': {
              display: 'none',
            },
            '& .MuiAccordionSummary-root': {
              borderBottom: `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`, // Adapta a cor da borda com base no tema
              backgroundColor: theme.palette.mode === 'dark' ? '#1b222a' : '#ffffff', // Adapta a cor de fundo com base no tema
            },
            '& .MuiAccordionDetails-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1b222a' : '#ffffff', // Adapta a cor de fundo com base no tema
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="h3" variant="subtitle2" color="text.primary">
              Há alguma garantia associada a este aplicativo?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ maxWidth: { sm: '100%', md: '70%' } }}
            >
              Como o aplicativo é parte de um portfólio para fins de demonstração, não há garantia associada. No entanto, estou aberto a feedbacks e sugestões para aprimorar o projeto e garantir que ele atenda às expectativas de quem o visualiza.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
}
