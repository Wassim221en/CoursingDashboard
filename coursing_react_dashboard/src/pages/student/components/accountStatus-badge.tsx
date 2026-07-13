/* eslint-disable no-nested-ternary */
import { Box, Typography } from '@mui/material';

type Props = {
  text: string;
  status: number;
};

function AccountStatusBadge({ text, status }: Props) {
  return status === 1 ? (
    <Box
      sx={{
        width: '100px',
        padding: 0.5,
        textAlign: 'center',
        bgcolor: 'green',
        color: 'white',
        borderRadius: 1,
      }}
    >
      {text}
    </Box>
  ) : status === 2 ? (
    <Box
      sx={{
        width: '100px',
        padding: 0.5,
        textAlign: 'center',
        bgcolor: 'red',
        color: 'white',
        borderRadius: 1,
      }}
    >
      {text}
    </Box>
  ) : (
    <Typography>N/A</Typography>
  );
}

export default AccountStatusBadge;
