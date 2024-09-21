import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

export const calculateStrength = (password: string) => {
  let strength = 0;

  if (password.length >= 12) strength += 1;

  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  const commonPatterns = ['123456', 'password', 'abc', 'qwerty', 'letmein'];
  if (commonPatterns.some(pattern => password.includes(pattern))) {
    strength -= 1;
  }
  return strength;
};
export const PasswordStrengthMeter = ({ passwordStrength }: { passwordStrength: number }) => {
  const strengthLabels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];


  const strength = Math.min(passwordStrength, strengthLabels.length - 1);
  const getColor = () => {
    switch (strength) {
      case 4: return 'success.main';
      case 3: return 'warning.main';
      case 2: return 'orange';
      case 1:
      case 0: return 'error.main';
      default: return 'lightgray';
    }
  };

  return (
    <Box width="100%" mt={2}>
      <Typography variant="body2" align="left">
        Força da senha: {strengthLabels[strength]}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(strength + 1) * (100 / strengthLabels.length)}
        sx={{
          height: 5,
          borderRadius: 2,
          bgcolor: 'lightgray',
          '& .MuiLinearProgress-bar': {
            bgcolor: getColor(),
          },
        }}
      />
    </Box>
  );
};
