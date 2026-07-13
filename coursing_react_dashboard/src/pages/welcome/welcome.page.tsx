import { Box, Typography } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function WelcomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        pt: 5,
      }}
    >
      <Box>
        <LazyLoadImage
          src="/assets/images/welcome.gif"
          style={{
            objectFit: 'contain',
            borderRadius: 4,
          }}
        />
      </Box>
      <Box sx={{ pt: 2, textAlign: 'center' }}>
        <LazyLoadImage
          src="/assets/logo/side-bar-logo.png"
          style={{
            objectFit: 'contain',
            width: 250,
          }}
        />
        <Typography sx={{ pt: 2, color: '#0056D2' }}>
          Think In Core Thing
        </Typography>
      </Box>
    </Box>
  );
}

export default WelcomePage;
