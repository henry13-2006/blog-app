import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300' // For poster images

export const tmdbApi = {
  // Get now playing movies
  async getNowPlaying() {
    try {
      const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1
        }
      })
      return response.data.results.slice(0, 3) // Return first 3 movies
    } catch (error) {
      console.error('Error fetching now playing movies:', error)
      return []
    }
  },

  // Get popular movies
  async getPopularMovies() {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1
        }
      })
      return response.data.results.slice(0, 3)
    } catch (error) {
      console.error('Error fetching popular movies:', error)
      return []
    }
  },

  // Get upcoming movies
  async getUpcomingMovies() {
    try {
      const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1
        }
      })
      return response.data.results.slice(0, 3)
    } catch (error) {
      console.error('Error fetching upcoming movies:', error)
      return []
    }
  },

  // Get top rated movies
  async getTopRatedMovies() {
    try {
      const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
        params: {
          api_key: API_KEY,
          language: 'en-US',
          page: 1
        }
      })
      return response.data.results.slice(0, 3)
    } catch (error) {
      console.error('Error fetching top rated movies:', error)
      return []
    }
  },

  // Search movies
  async searchMovies(query) {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          language: 'en-US',
          page: 1
        }
      })
      return response.data.results.slice(0, 3)
    } catch (error) {
      console.error('Error searching movies:', error)
      return []
    }
  }
}

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/200x120/6C5CE7/FFFFFF?text=No+Image'
  return `${IMAGE_BASE_URL}${path}`
}

export default tmdbApi
