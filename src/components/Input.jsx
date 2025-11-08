import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useState } from 'react'

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  showPasswordToggle = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const inputType = showPasswordToggle && showPassword ? 'text' : type

  const endAdornment = showPasswordToggle ? (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        edge="end"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  ) : null

  return (
    <TextField
      label={label}
      name={name}
      type={inputType}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error || helperText}
      required={required}
      fullWidth
      variant="outlined"
      InputProps={{
        endAdornment,
      }}
      {...props}
    />
  )
}

export default Input
