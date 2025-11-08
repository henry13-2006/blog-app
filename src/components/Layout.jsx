import { Box, Container } from '@mui/material'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: 4, mt: 8 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Outlet />
            </Box>
            <Sidebar />
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}

export default Layout
