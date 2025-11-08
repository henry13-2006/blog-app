import { Box, Container, useTheme, useMediaQuery } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden'
    }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 1, sm: 2, md: 4 },
          mt: { xs: 6, sm: 7, md: 8 },
          px: { xs: 0.5, sm: 1, md: 2 },
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 0.5, sm: 1, md: 2 },
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <Box sx={{
            display: 'flex',
            gap: isMobile ? 0 : { md: 2, lg: 4 },
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%'
          }}>
            <Box sx={{
              flex: 1,
              width: '100%',
              minHeight: isMobile ? 'auto' : '60vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Outlet />
            </Box>
            {!isMobile && (
              <Box sx={{
                width: { md: '250px', lg: '300px' },
                flexShrink: 0,
                ml: { md: 1, lg: 2 }
              }}>
                <Sidebar />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}

export default Layout
