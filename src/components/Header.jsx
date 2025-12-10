import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const navigationItems = [
    { path: '/', label: 'Latest' },
    { path: '/fashion', label: 'Fashion' },
    { path: '/luxury', label: 'Luxury' },
    { path: '/lifestyle', label: 'Lifestyle' },
    { path: '/beauty', label: 'Beauty' },
    { path: '/travel', label: 'Travel' },
    { path: '/events', label: 'Events' },
    { path: '/sports', label: 'Sports' },
    { path: '/videos', label: 'Videos' },
    { path: '/cartoons', label: 'Cartoons' },
  ]

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMobileMenuClick = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black', top: 0, zIndex: 1100, width: '100%' }}>
        <Toolbar sx={{
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%',
          px: { xs: 0.5, sm: 1, md: 2 },
          minHeight: { xs: 48, sm: 56, md: 64 }
        }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              onClick={toggleMobileMenu}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  sx={{
                    fontSize: '0.9rem',
                    transition: 'background-color 0.3s ease',
                    backgroundColor: location.pathname === item.path ? 'grey.500' : 'transparent',
                    '&:hover': { backgroundColor: location.pathname === item.path ? 'grey.500' : '#f0f0f0' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile: Show current page title */}
          {isMobile && (
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
              {navigationItems.find(item => item.path === location.pathname)?.label || 'Blog'}
            </Typography>
          )}

          {/* Search Bar - Hide on mobile to save space */}
          {!isMobile && (
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
          )}


        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: 'white',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Navigation
          </Typography>
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleMobileMenuClick(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'grey.100',
                      '&:hover': {
                        backgroundColor: 'grey.200',
                      },
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Mobile Search */}
          <Box sx={{ mt: 2, px: 2 }}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
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
              />
            </form>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default Header
