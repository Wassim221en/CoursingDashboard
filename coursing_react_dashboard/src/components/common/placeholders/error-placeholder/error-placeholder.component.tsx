import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouteError, useNavigate } from 'react-router-dom';
// import env from 'constants/env';

const isThrownError = (err: any): err is Error =>
  'message' in err && 'stack' in err;

function ErrorPlaceholder() {
  const err = useRouteError();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '95vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {isThrownError(err) && (
        <>
          <Typography variant="h4" color="GrayText">
            oops.. something went wrong
          </Typography>
          <Box
            sx={{
              backgroundColor: '#eee4',
              padding: 4,
              maxWidth: '90vw',
              borderRadius: 2,
              '*': { fontFamily: 'monospace' },
            }}
          >
            <span>
              <b>{isThrownError(err) ? err.message : `${err}`}</b>
            </span>
            <Box
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              {err.stack?.split('\n').map((stackItem) => (
                <span key={stackItem}>{stackItem}</span>
              ))}
            </Box>
          </Box>
        </>
      )}
      <Button
        onClick={() => {
          navigate('/dashboard/statistic');
          window.location.reload();
        }}
      >
        Reload page
      </Button>
    </Box>
  );
}

export default ErrorPlaceholder;
