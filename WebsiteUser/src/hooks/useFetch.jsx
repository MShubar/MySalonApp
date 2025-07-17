import { useState, useEffect } from 'react'
import axios from 'axios'

const useFetch = (url, deps = []) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) {
      setData([])
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🌐 Fetching from:', url)
        const response = await axios.get(url)
        console.log('✅ Fetched data:', response.data)
        setData(response.data || [])
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('❌ Axios error:', err.response?.data || err.message)
        } else {
          console.error('❌ Unknown error:', err)
        }
        setError(err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, deps)

  return { data, loading, error }
}

export default useFetch
