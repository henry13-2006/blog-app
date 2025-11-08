import { useState, useEffect } from 'react'
import { Container, Typography, Box, Card, CardContent, CardMedia, Grid, CircularProgress, Alert, Button } from '@mui/material'
import { newsApi } from '../services/newsApi'

function Events() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventsArticles = async () => {
      try {
        setLoading(true)
        const eventsArticles = await newsApi.getTopHeadlines('events', 12)
        setArticles(eventsArticles)
      } catch (err) {
        setError('Failed to load events articles')
        console.error('Error fetching events articles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEventsArticles()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Events
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Event coverage, party ideas, concert reviews, and festival guides for staying up-to-date.
      </Typography>

      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              component="a"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
              }}
            >
              {article.urlToImage && (
                <CardMedia
                  component="img"
                  height="200"
                  image={article.urlToImage}
                  alt={article.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'text.primary' }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.description || 'No description available'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.publishedAt).toLocaleDateString()} • {article.source.name}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {articles.length === 0 && !loading && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No events articles available at the moment.
        </Typography>
      )}
    </Box>
  )
}

export default Events
