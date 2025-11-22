import axios from 'axios'

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE_URL = 'https://www.omdbapi.com/'

export const omdbApi = {
  // Get popular movies (using predefined popular movie titles)
  async getPopularMovies() {
    const popularTitles = [
      'The Shawshank Redemption',
      'The Godfather',
      'The Dark Knight',
      'Pulp Fiction',
      'Forrest Gump'
    ]

    try {
      const moviePromises = popularTitles.map(title =>
        axios.get(BASE_URL, {
          params: {
            apikey: API_KEY,
            t: title,
            type: 'movie'
          }
        })
      )

      const responses = await Promise.allSettled(moviePromises)
      const movies = responses
        .filter(response => response.status === 'fulfilled')
        .map(response => response.value.data)
        .filter(movie => movie.Response === 'True')
        .slice(0, 5)

      return movies
    } catch (error) {
      console.error('Error fetching popular movies:', error)
      return []
    }
  },

  // Get movie by title
  async getMovieByTitle(title) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          t: title,
          type: 'movie'
        }
      })

      if (response.data.Response === 'True') {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error fetching movie:', error)
      return null
    }
  },

  // Search movies by query
  async searchMovies(query) {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          apikey: API_KEY,
          s: query,
          type: 'movie'
        }
      })

      if (response.data.Response === 'True') {
        return response.data.Search || []
      }
      return []
    } catch (error) {
      console.error('Error searching movies:', error)
      return []
    }
  }
}

// Helper function to get poster URL (OMDB returns full URL)
export const getPosterUrl = (poster) => {
  if (!poster || poster === 'N/A') {
    return 'https://via.placeholder.com/200x300/6C5CE7/FFFFFF?text=No+Poster'
  }
  return poster
}

export default omdbApi
