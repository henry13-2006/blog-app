import { useNavigate, Link } from 'react-router-dom'
import { Box, Typography, Alert } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useFormValidation } from '../hooks/useFormValidation'
import Input from '../components/Input'
import Button from '../components/Button'

function Login() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  // Validation rules
  const validationRules = {
    email: { required: true, email: true },
    password: { required: true, minLength: 6 }
  }

  // Initial form values
  const initialValues = {
    email: '',
    password: ''
  }

  // Use validation hook
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation(initialValues, validationRules)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return // Don't submit if validation fails
    }

    try {
      await login(values.email, values.password)
      navigate('/') // Redirect to home on success
    } catch (err) {
      // Error handled in context
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          showPasswordToggle
          required
        />
        <Button type="submit" loading={loading} fullWidth>
          Login
        </Button>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </Typography>
    </Box>
  )
}

export default Login
