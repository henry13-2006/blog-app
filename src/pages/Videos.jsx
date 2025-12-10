import { useState, useEffect } from 'react'
import { Typography, Box, Grid, Card, CardContent, CardMedia, Button, Chip, CircularProgress, Alert } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { youtubeApi } from '../services/youtubeApi'

function Videos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        // Get popular videos from YouTube
        const videoData = await youtubeApi.getPopularVideos(12)

        // Transform YouTube data to match our component structure
        const transformedVideos = videoData.map(video => ({
          id: video.id,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.medium.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          views: video.statistics ? youtubeApi.formatViewCount(video.statistics.viewCount) : 'N/A views',
          videoId: video.id
        }))

        setVideos(transformedVideos)
      } catch (err) {
        console.error('Error loading videos:', err)
        setError('Failed to load videos. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Handle video click
  const handleVideoClick = (videoId) => {
    window.open(`https://www.dailymotion.com/video/${videoId}`, '_blank')
  }

  if (loading) {
    return (
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading videos...</Typography>
      </Box>
    )
  }

  if (error) {
    // Fallback content when API fails
    const fallbackVideos = [
      {
        id: 'sample-1',
        title: 'Welcome to Our Video Collection',
        thumbnail: 'https://via.placeholder.com/480x360/2770a0/ffffff?text=Featured+Video',
        channelTitle: 'Nexora Blog',
        views: 'Featured Content',
        videoId: 'dQw4w9WgXcQ' // Rickroll as placeholder
      },
      {
        id: 'sample-2',
        title: 'Behind the Scenes',
        thumbnail: 'https://via.placeholder.com/480x360/0984E3/ffffff?text=Behind+Scenes',
        channelTitle: 'Nexora Blog',
        views: 'Coming Soon',
        videoId: 'dQw4w9WgXcQ'
      },
      {
        id: 'sample-3',
        title: 'Tutorial Series',
        thumbnail: 'https://via.placeholder.com/480x360/6C5CE7/ffffff?text=Tutorials',
        channelTitle: 'Nexora Blog',
        views: 'Learn More',
        videoId: 'dQw4w9WgXcQ'
      }
    ]

    return (
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6, py: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Videos
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Our video collection is currently being updated. Check back soon!
          </Typography>
        </Box>

        {/* Fallback Video Grid */}
        <Grid container spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          {fallbackVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={video.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-4px)', md: 'translateY(-8px)' },
                    boxShadow: { xs: 2, sm: 4, md: 6 }
                  },
                  borderRadius: { xs: 2, sm: 3 },
                  cursor: 'pointer',
                  mx: 'auto',
                  maxWidth: { xs: '100%', sm: '100%', md: '100%' }
                }}
                onClick={() => window.open('https://www.youtube.com', '_blank')}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={{ xs: 180, sm: 200, md: 225 }}
                    image={video.thumbnail}
                    alt={video.title}
                    sx={{
                      objectFit: 'cover',
                      width: '100%'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: '50%',
                      width: { xs: 40, sm: 50, md: 60 },
                      height: { xs: 40, sm: 50, md: 60 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        transform: 'translate(-50%, -50%) scale(1.1)'
                      }
                    }}
                  >
                    <PlayArrowIcon sx={{
                      color: 'white',
                      fontSize: { xs: 20, sm: 24, md: 30 }
                    }} />
                  </Box>
                </Box>
                <CardContent sx={{
                  flexGrow: 1,
                  p: { xs: 1.5, sm: 2, md: 3 },
                  '&:last-child': { pb: { xs: 1.5, sm: 2, md: 3 } }
                }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
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
                      mb: 1,
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    {video.channelTitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    {video.views}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call to action */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Want to see real videos?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're working on integrating YouTube videos. Check back soon!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6, py: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Videos
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Watch popular videos from YouTube
        </Typography>
      </Box>

      {/* Video Grid - Fully Responsive */}
      <Grid container spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={video.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-4px)', md: 'translateY(-8px)' },
                  boxShadow: { xs: 2, sm: 4, md: 6 }
                },
                borderRadius: { xs: 2, sm: 3 },
                cursor: 'pointer',
                mx: 'auto',
                maxWidth: { xs: '100%', sm: '100%', md: '100%' }
              }}
              onClick={() => handleVideoClick(video.videoId)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={{ xs: 180, sm: 200, md: 225 }}
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{
                    objectFit: 'cover',
                    width: '100%'
                  }}
                />
                {/* Play button overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    width: { xs: 40, sm: 50, md: 60 },
                    height: { xs: 40, sm: 50, md: 60 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      transform: 'translate(-50%, -50%) scale(1.1)'
                    }
                  }}
                >
                  <PlayArrowIcon sx={{
                    color: 'white',
                    fontSize: { xs: 20, sm: 24, md: 30 }
                  }} />
                </Box>
              </Box>
              <CardContent sx={{
                flexGrow: 1,
                p: { xs: 1.5, sm: 2, md: 3 },
                '&:last-child': { pb: { xs: 1.5, sm: 2, md: 3 } }
              }}>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    lineHeight: 1.3,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
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
                    mb: 1,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                  }}
                >
                  {video.channelTitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }
                  }}
                >
                  {video.views}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          sx={{ px: 6, py: 2 }}
          onClick={() => window.location.reload()} // Simple reload for now
        >
          Load More Videos
        </Button>
      </Box>
    </Box>
  )
}

export default Videos
