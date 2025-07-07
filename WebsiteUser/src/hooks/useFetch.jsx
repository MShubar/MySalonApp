// src/hooks/useFetch.js
import { useState, useEffect } from 'react'
import axios from 'axios'

const useFetch = (url, deps = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(url)
        setData(response.data)
      } catch (err) {
        console.error(`useFetch error: ${err}`)
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, deps)

  return { data, loading, error }
}

export default useFetch
