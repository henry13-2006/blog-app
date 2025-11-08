import { useState, useEffect } from 'react'
import { Typography, Box, Grid, Card, CardContent, CardMedia, CircularProgress, Alert } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { youtubeApi } from '../services/youtubeApi'

function Cartoons() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCartoonVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        // Get cartoon videos from YouTube
        const videoData = await youtubeApi.getCartoonVideos(24) // More videos for full page

        // Transform YouTube data
        const transformedVideos = videoData.map(video => ({
          id: video.id.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.medium.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          description: video.snippet.description,
          videoId: video.id.videoId
        }))

        setVideos(transformedVideos)
      } catch (err) {
        console.error('Error loading cartoon videos:', err)
        setError('Failed to load cartoons. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCartoonVideos()
  }, [])

  // Handle video click
  const handleVideoClick = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  if (loading) {
    return (
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading cartoons...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ maxWidth: '600px', mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6, py: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 3 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🎬 Kids Cartoons & Animation
        </Typography>
        <Typography variant="h5" sx={{ maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
          Enjoy fun cartoons, animations, and kids content from YouTube
        </Typography>
      </Box>

      {/* Video Grid - Fully Responsive */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ width: '100%' }}>
        {videos.map((video) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={video.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-4px)', md: 'translateY(-8px)' },
                  boxShadow: { xs: 2, sm: 4, md: 6 },
                  '& .play-button': {
                    opacity: 1,
                    transform: 'scale(1.1)'
                  }
                },
                borderRadius: { xs: 2, sm: 3 },
                cursor: 'pointer',
                background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                mx: 'auto',
                maxWidth: '100%'
              }}
              onClick={() => handleVideoClick(video.videoId)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={{ xs: 120, sm: 140, md: 160, lg: 180 }}
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{
                    objectFit: 'cover',
                    width: '100%'
                  }}
                />
                {/* Play button overlay */}
                <Box
                  className="play-button"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255, 20, 147, 0.9)',
                    borderRadius: '50%',
                    width: { xs: 35, sm: 40, md: 45, lg: 50 },
                    height: { xs: 35, sm: 40, md: 45, lg: 50 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    opacity: 0.8,
                    boxShadow: '0 4px 12px rgba(255, 20, 147, 0.4)'
                  }}
                >
                  <PlayArrowIcon sx={{
                    color: 'white',
                    fontSize: { xs: 16, sm: 18, md: 20, lg: 24 }
                  }} />
                </Box>
              </Box>
              <CardContent sx={{
                flexGrow: 1,
                p: { xs: 1, sm: 1.5, md: 2 },
                '&:last-child': { pb: { xs: 1, sm: 1.5, md: 2 } }
              }}>
                <Typography
                  variant="subtitle1"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    lineHeight: 1.3,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.9rem' },
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {video.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }
                  }}
                >
                  {video.channelTitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Section */}
      <Box sx={{ textAlign: 'center', mt: 8, py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#667eea', fontWeight: 'bold' }}>
          🎪 More Fun Content Coming Soon!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We're constantly adding new cartoons and animations for kids
        </Typography>
      </Box>
    </Box>
  )
}

export default Cartoons
