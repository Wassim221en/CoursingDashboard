import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useState } from 'react';

function PasswordCell({ password }: { password: string }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [show, setShow] = useState(false);

  return (
    <Box display="flex" alignItems="center" gap={1} width={120}>
      <IconButton onClick={() => setShow((prev) => !prev)}>
        {show ? <Visibility /> : <VisibilityOff />}
      </IconButton>
      <Box pt={show ? 0 : 0}>{show ? password : '********'}</Box>
    </Box>
  );
}
export default PasswordCell;

