import { useState, useEffect } from 'react'
import { Typography, Box, Grid, Card, CardContent, CardMedia, CircularProgress, Alert, Button } from '@mui/material'
import { newsApi } from '../services/newsApi'

function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        setLoading(true)
        console.log('Fetching latest articles...')
        console.log('API Key available:', !!import.meta.env.VITE_NEWS_API_KEY)

        const latestArticles = await newsApi.getLatestArticles(12)
        console.log('Articles received:', latestArticles?.length || 0)
        console.log('First article:', latestArticles?.[0])

        setArticles(latestArticles)
      } catch (err) {
        console.error('Error fetching latest articles:', err)
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        })
        setError(`Failed to load latest articles: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestArticles()
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
          Latest News
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6, py: 4, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Latest News
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Stay updated with the most recent articles from around the web
        </Typography>
      </Box>

      {/* Featured Article */}
      {articles.length > 0 && (
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Featured Story
          </Typography>
          <Card
            component="a"
            href={articles[0].url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              mb: 6,
              boxShadow: 4,
              borderRadius: 3,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
            }}
          >
            {articles[0].urlToImage && (
              <CardMedia
                component="img"
                sx={{ width: { xs: '100%', md: 500 }, height: { xs: 300, md: 400 }, objectFit: 'cover' }}
                image={articles[0].urlToImage}
                alt={articles[0].title}
              />
            )}
            <CardContent sx={{ flex: 1, p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.2, color: 'text.primary' }}>
                {articles[0].title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                {articles[0].description || 'No description available'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                  {new Date(articles[0].publishedAt).toLocaleDateString()} • {articles[0].source.name}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Article Grid */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        More Stories
      </Typography>
      <Grid container spacing={6}>
        {articles.slice(1).map((article, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              component="a"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                borderRadius: 3,
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              {article.urlToImage && (
                <CardMedia
                  component="img"
                  height="280"
                  image={article.urlToImage}
                  alt={article.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.3, color: 'text.primary' }}>
                  {article.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {article.description ? article.description.substring(0, 200) + '...' : 'No description available'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
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
          No articles available at the moment.
        </Typography>
      )}
    </Box>
  )
}

export default Home
