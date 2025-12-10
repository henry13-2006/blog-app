import { useState, useEffect } from 'react'
import { Box, Typography, Card, CardContent, CardMedia, Chip, Divider, CircularProgress } from '@mui/material'
import MovieIcon from '@mui/icons-material/Movie'
import AnimationIcon from '@mui/icons-material/Animation'
import { omdbApi, getPosterUrl } from '../services/tmdbApi'

function Sidebar() {
  const [movies, setMovies] = useState([])
  const [cartoons, setCartoons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntertainmentData = async () => {
      try {
        setLoading(true)

        // Fetch popular movies from OMDB
        const movieData = await omdbApi.getPopularMovies()

        // Transform OMDB movie data
        const movieItems = movieData.map((movie) => ({
          id: movie.imdbID,
          title: movie.Title?.substring(0, 30) + (movie.Title?.length > 30 ? '...' : '') || 'Movie',
          image: getPosterUrl(movie.Poster),
          rating: movie.imdbRating || 'N/A'
        }))

        // Fetch additional movies using OMDB
        const additionalMovieTitles = [
          'Inception', 'Interstellar', 'The Matrix', 'Avatar', 'Titanic',
          'Jurassic Park', 'Star Wars', 'The Avengers', 'Iron Man', 'Spider-Man'
        ]

        const additionalMoviePromises = additionalMovieTitles.slice(0, 8).map(title => omdbApi.getMovieByTitle(title))
        const additionalResponses = await Promise.allSettled(additionalMoviePromises)
        const additionalMovies = additionalResponses
          .filter(response => response.status === 'fulfilled' && response.value)
          .map(response => response.value)
          .map((movie, index) => ({
            id: `movie-${index + 1}`,
            title: movie.Title?.substring(0, 30) + (movie.Title?.length > 30 ? '...' : '') || 'Movie',
            image: getPosterUrl(movie.Poster),
            rating: movie.imdbRating || 'N/A'
          }))

        setMovies(movieItems)
        setCartoons(additionalMovies)
      } catch (error) {
        console.error('Error fetching entertainment data:', error)
        // Fallback data
        setMovies([
          { id: 1, title: "Latest Movie Releases", image: "https://via.placeholder.com/200x120/6C5CE7/FFFFFF?text=Movies", rating: "8.5" }
        ])
        setCartoons([
          { id: 1, title: "New Movie Releases", image: "https://via.placeholder.com/200x120/0984E3/FFFFFF?text=Movies", rating: "8.2" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEntertainmentData()
  }, [])

  return (
    <Box sx={{ width: 300, p: 2, display: { xs: 'none', lg: 'block' } }}>
      {/* Movies Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MovieIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Now Showing
          </Typography>
        </Box>

        {movies.map((movie) => (
          <Card
            key={movie.id}
            onClick={() => window.open(`https://www.imdb.com/title/${movie.id}`, '_blank')}
            sx={{ mb: 3, cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }, borderRadius: 2 }}
          >
            <CardMedia
              component="img"
              sx={{ width: '100%', height: 120, objectFit: 'cover' }}
              image={movie.image}
              alt={movie.title}
            />
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', lineHeight: 1.3, mb: 1 }}>
                {movie.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Chip label="Movie" size="small" color="primary" variant="outlined" />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  ⭐ {movie.rating}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Movies Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MovieIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Latest Movies
          </Typography>
        </Box>

        {cartoons.map((movie) => (
          <Card
            key={movie.id}
            onClick={() => window.open(`https://www.imdb.com/title/${movie.id}`, '_blank')}
            sx={{ mb: 3, cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }, borderRadius: 2 }}
          >
            <CardMedia
              component="img"
              sx={{ width: '100%', height: 120, objectFit: 'cover' }}
              image={movie.image}
              alt={movie.title}
            />
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', lineHeight: 1.3, mb: 1 }}>
                {movie.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Chip label="Movie" size="small" color="secondary" variant="outlined" />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  ⭐ {movie.rating}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default Sidebar
