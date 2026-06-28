import { useState, useCallback } from 'react'
import api from '../api/axios'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (method, url, data = null, config = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api[method](url, data, config)
      return res.data
    } catch (e) {
      setError(e.response?.data?.detail || e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, request }
}
