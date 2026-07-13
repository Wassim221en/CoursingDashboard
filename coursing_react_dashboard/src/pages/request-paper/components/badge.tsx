/* eslint-disable no-nested-ternary */
import { Box } from '@mui/material';

type Props = {
  text: string;
  status: number;
};

function StatusBadge({ text, status }: Props) {
  return status === 1 ? (
    <Box
      sx={{
        width: '100px',
        padding: 0.5,
        textAlign: 'center',
        bgcolor: 'yellow',
        color: 'black',
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
        bgcolor: 'blue',
        color: 'white',
        borderRadius: 1,
      }}
    >
      {text}
    </Box>
  ) : status === 3 ? (
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
  ) : status === 4 ? (
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
    <Box
      sx={{
        width: '100px',
        padding: 0.5,
        textAlign: 'center',
        color: 'black',
        borderRadius: 1,
      }}
    >
      {text}
    </Box>
  );
}

export default StatusBadge;
