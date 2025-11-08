import { useState, useEffect } from 'react'
import { Box, Typography, Card, CardContent, CardMedia, Chip, Divider, CircularProgress } from '@mui/material'
import MovieIcon from '@mui/icons-material/Movie'
import AnimationIcon from '@mui/icons-material/Animation'
import { tmdbApi, getImageUrl } from '../services/tmdbApi'

function Sidebar() {
  const [movies, setMovies] = useState([])
  const [cartoons, setCartoons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEntertainmentData = async () => {
      try {
        setLoading(true)

        // Fetch real movies from TMDB
        const movieData = await tmdbApi.getNowPlaying()

        // Transform TMDB movie data
        const movieItems = movieData.map((movie) => ({
          id: movie.id,
          title: movie.title?.substring(0, 30) + (movie.title?.length > 30 ? '...' : '') || 'Movie',
          image: getImageUrl(movie.poster_path),
          rating: movie.vote_average?.toFixed(1) || 'N/A'
        }))

        // Fetch cartoons using NewsAPI (TMDB doesn't have great cartoon data)
        const cartoonResponse = await fetch(`https://newsapi.org/v2/everything?q=cartoon+network+OR+disney+channel+OR+"spider-man"+OR+"elemental"+OR+"nimona"+OR+pixar+OR+"turning+red"&sortBy=publishedAt&pageSize=3&apiKey=933c654a6f30457ba2032b23d6c1564b`)
        const cartoonData = await cartoonResponse.json()

        // Transform cartoon data
        const cartoonItems = cartoonData.articles?.slice(0, 3).map((article, index) => ({
          id: index + 1,
          title: article.title?.substring(0, 30) + '...' || 'Cartoon News',
          image: article.urlToImage || `https://via.placeholder.com/200x120/0984E3/FFFFFF?text=Cartoon+${index + 1}`,
          rating: (Math.random() * 2 + 7).toFixed(1) // Random rating between 7-9
        })) || []

        setMovies(movieItems)
        setCartoons(cartoonItems)
      } catch (error) {
        console.error('Error fetching entertainment data:', error)
        // Fallback data
        setMovies([
          { id: 1, title: "Latest Movie Releases", image: "https://via.placeholder.com/200x120/6C5CE7/FFFFFF?text=Movies", rating: "8.5" }
        ])
        setCartoons([
          { id: 1, title: "New Animated Films", image: "https://via.placeholder.com/200x120/0984E3/FFFFFF?text=Cartoons", rating: "8.2" }
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
          <Card key={movie.id} sx={{ mb: 3, cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }, borderRadius: 2 }}>
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

      {/* Cartoons Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AnimationIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Latest Cartoons
          </Typography>
        </Box>

        {cartoons.map((cartoon) => (
          <Card key={cartoon.id} sx={{ mb: 3, cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }, borderRadius: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: '100%', height: 120, objectFit: 'cover' }}
              image={cartoon.image}
              alt={cartoon.title}
            />
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', lineHeight: 1.3, mb: 1 }}>
                {cartoon.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Chip label="Cartoon" size="small" color="secondary" variant="outlined" />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                  ⭐ {cartoon.rating}
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
