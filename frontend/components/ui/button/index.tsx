import React from 'react';
import Button from '@mui/material/Button';

interface MaterialButtonProps {
  label: string;
  onClick?: () => void;
}

const MaterialButton: React.FC<MaterialButtonProps> = ({ label, onClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {label}
    </Button>
  );
};

export default MaterialButton;
