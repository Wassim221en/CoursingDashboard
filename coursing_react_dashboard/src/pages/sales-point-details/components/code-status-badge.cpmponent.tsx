/* eslint-disable no-nested-ternary */
import { Box } from '@mui/material';

type Props = {
  text: string;
  status: number;
};

function CodeStatusBadge({ text, status }: Props) {
  return status === 2 || status === 4 ? (
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
  ) : status === 3 ? (
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
  ) : status === 1 ? (
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

export default CodeStatusBadge;
