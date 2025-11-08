import { Box, Typography } from '@mui/material'

function Footer() {
  return (
    <Box sx={{ py: 2, backgroundColor: 'text.secondary', color: 'white' }}>
      <Typography variant="body2" align="center">
        © Henry's 2025 Blog App. All rights reserved.
      </Typography>
    </Box>
  )
}

export default Footer
