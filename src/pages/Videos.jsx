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
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
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
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ maxWidth: '600px', mx: 'auto' }}>
          {error}
        </Alert>
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

      {/* Video Grid */}
      <Grid container spacing={4}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} lg={4} key={video.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                borderRadius: 3,
                cursor: 'pointer'
              }}
              onClick={() => handleVideoClick(video.videoId)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="225"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ objectFit: 'cover' }}
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
                    width: 60,
                    height: 60,
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
                  <PlayArrowIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                  {video.title.length > 60 ? `${video.title.substring(0, 60)}...` : video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {video.channelTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
