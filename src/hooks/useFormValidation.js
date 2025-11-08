import { useState, useCallback } from 'react'

export const useFormValidation = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Validation rules
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name]
    if (!rules) return ''

    // Required validation
    if (rules.required && (!value || value.trim() === '')) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
    }

    // Email validation
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rules.maxLength} characters`
    }

    // Password strength validation
    if (rules.password && value) {
      if (value.length < 8) {
        return 'Password must be at least 8 characters'
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Password must contain at least one lowercase letter'
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Password must contain at least one uppercase letter'
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Password must contain at least one number'
      }
    }

    // Custom validation function
    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value, values)
    }

    return ''
  }, [validationRules, values])

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  // Handle blur (field touched)
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    // Validate field on blur
    const error = validateField(name, values[name])
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [validateField, values])

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

    return isValid
  }, [validateField, values, validationRules])

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  // Check if form is valid
  const isValid = Object.keys(errors).every(key => !errors[key])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    isValid,
    setValues
  }
}
