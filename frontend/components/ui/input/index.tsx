import React from 'react'
import TextField from '@mui/material/TextField'

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <TextField
      type="email"
      label="Email"
      variant="outlined"
      value={value}
      onChange={handleChange}
      fullWidth
    />
  )
}

export default EmailInput
