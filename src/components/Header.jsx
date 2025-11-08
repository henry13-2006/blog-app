import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment, IconButton } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black', top: 0, zIndex: 1100, width: '100%' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Latest
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/fashion"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/fashion' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/fashion' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Fashion
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/luxury"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/luxury' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/luxury' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Luxury
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/lifestyle"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/lifestyle' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/lifestyle' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Lifestyle
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/beauty"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/beauty' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/beauty' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Beauty
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/travel"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/travel' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/travel' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Travel
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/events"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/events' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/events' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Events
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/sports"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/sports' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/sports' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Sports
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/videos"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/videos' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/videos' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            Videos
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/cartoons"
            sx={{
              fontSize: '0.9rem',
              transition: 'background-color 0.3s ease',
              backgroundColor: location.pathname === '/cartoons' ? 'grey.500' : 'transparent',
              '&:hover': { backgroundColor: location.pathname === '/cartoons' ? 'grey.500' : '#f0f0f0' },
            }}
          >
            🎬 Cartoons
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mx: 2, minWidth: '200px' }}>
          <form onSubmit={handleSearch}>
            <TextField
              size="small"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" size="small">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                }
              }}
            />
          </form>
        </Box>

        <Box>
          {isAuthenticated ? (
            <>
              <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                {user.name}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Box>
    </AppBar>
  )
}

export default Header
