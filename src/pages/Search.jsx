import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Typography, Box, Grid, Card, CardContent, CardMedia, CircularProgress, Alert, Button } from '@mui/material'
import { newsApi } from '../services/newsApi'

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) return

      try {
        setLoading(true)
        const searchResults = await newsApi.searchArticles(query, 20)
        setArticles(searchResults)
      } catch (err) {
        setError('Failed to search articles')
        console.error('Error searching articles:', err)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query])

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
          Search Results for "{query}"
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results for "{query}"
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Found {articles.length} articles matching your search.
      </Typography>

      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                <Typography variant="h6" component="h2" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {article.description || 'No description available'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.publishedAt).toLocaleDateString()} • {article.source.name}
                  </Typography>
                  <Button
                    size="small"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {articles.length === 0 && !loading && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No articles found for "{query}". Try different keywords.
        </Typography>
      )}
    </Box>
  )
}

export default Search
