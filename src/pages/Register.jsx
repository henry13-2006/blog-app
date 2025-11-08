import { useNavigate, Link } from 'react-router-dom'
import { Box, Typography, Alert } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useFormValidation } from '../hooks/useFormValidation'
import Input from '../components/Input'
import Button from '../components/Button'

function Register() {
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  // Validation rules
  const validationRules = {
    name: { required: true, minLength: 2 },
    email: { required: true, email: true },
    password: { required: true, password: true },
    confirmPassword: {
      required: true,
      custom: (value, values) => !values.password || value === values.password ? '' : 'Passwords do not match'
    }
  }

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
      await register({
        name: values.name,
        email: values.email,
        password: values.password
      })
      navigate('/') // Redirect to home on success
    } catch (err) {
      // Error handled in context
    }
  }

  return (
    <Box sx={{
      maxWidth: { xs: '100%', sm: 400 },
      mx: 'auto',
      mt: { xs: 2, sm: 4 },
      px: { xs: 2, sm: 0 }
    }}>
      <Typography variant="h4" gutterBottom align="center">
        Register
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Input
          label="Name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          required
        />
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
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          showPasswordToggle
          required
        />
        <Button type="submit" loading={loading} fullWidth>
          Register
        </Button>
      </Box>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Box>
  )
}

export default Register
