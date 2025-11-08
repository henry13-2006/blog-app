import { useState, useEffect } from 'react'
import { Container, Typography, Box, Card, CardContent, CardMedia, Grid, CircularProgress, Alert, Button } from '@mui/material'
import { newsApi } from '../services/newsApi'

function Fashion() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFashionArticles = async () => {
      try {
        setLoading(true)
        const fashionArticles = await newsApi.getTopHeadlines('fashion', 12)
        setArticles(fashionArticles)
      } catch (err) {
        setError('Failed to load fashion articles')
        console.error('Error fetching fashion articles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFashionArticles()
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
          Fashion
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Category Header */}
      <Box sx={{ textAlign: 'center', mb: 6, py: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Fashion
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Discover the latest fashion trends, designer outfits, and style tips for the modern individual
        </Typography>
      </Box>

      {/* Article Grid */}
      <Grid container spacing={4}>
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card
              component="a"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 2,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              {article.urlToImage && (
                <CardMedia
                  component="img"
                  height="220"
                  image={article.urlToImage}
                  alt={article.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.3, color: 'text.primary' }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                  {article.description ? article.description.substring(0, 120) + '...' : 'No description available'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
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
          No fashion articles available at the moment.
        </Typography>
      )}
    </Box>
  )
}

export default Fashion
