import { useState, useCallback } from 'react'

/**
 * useForm — manages field values, touched state, errors, and submission.
 *
 * @param {Object} initialValues  — { fieldName: initialValue }
 * @param {Object} validatorMap   — { fieldName: (value, allValues) => errorString | null }
 */
export function useForm(initialValues, validatorMap) {
  const [values, setValues]   = useState(initialValues)
  const [errors, setErrors]   = useState({})
  const [touched, setTouched] = useState({})

  const validate = useCallback(
    (vals = values) => {
      const errs = {}
      for (const field of Object.keys(validatorMap)) {
        const err = validatorMap[field](vals[field], vals)
        if (err) errs[field] = err
      }
      return errs
    },
    [validatorMap, values]
  )

  function handleChange(field, value) {
    const next = { ...values, [field]: value }
    setValues(next)

    // Re-validate this field (and confirmPassword when password changes)
    if (touched[field]) {
      const fieldErr = validatorMap[field]?.(value, next)
      setErrors((prev) => ({ ...prev, [field]: fieldErr || null }))
    }

    // When password changes, also re-validate confirmPassword if touched
    if (field === 'password' && touched.confirmPassword && validatorMap.confirmPassword) {
      const cpErr = validatorMap.confirmPassword(next.confirmPassword, next)
      setErrors((prev) => ({ ...prev, confirmPassword: cpErr || null }))
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const err = validatorMap[field]?.(values[field], values)
    setErrors((prev) => ({ ...prev, [field]: err || null }))
  }

  function touchAll() {
    const allTouched = Object.keys(validatorMap).reduce((acc, k) => {
      acc[k] = true
      return acc
    }, {})
    setTouched(allTouched)
  }

  function isValid(errs = validate()) {
    return Object.values(errs).every((e) => !e)
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    touchAll,
    isValid,
    setErrors,
  }
}