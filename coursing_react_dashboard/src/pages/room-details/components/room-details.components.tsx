import { IRoom } from 'apis/room/room.interfaces';
import { Box, Container, Stack, Typography } from '@mui/material';
import PasswordCell from 'components/common/password-cell/password-cell.component';
import { sanitizeHtml } from 'utils/helpers';
import { useTranslation } from 'react-i18next';

function RoomDetails({ room }: { room: IRoom }) {
  const { admin, description, name, password } = room;

  const { t } = useTranslation();

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 5,
          mb: 5,
          p: 3,
          borderRadius: 2,
          bgcolor: '#f1f1f1',
          textAlign: 'center',
        }}
      >
        <Stack>
          <Typography fontWeight="bold">{t('rooms.name')}: </Typography>
          <Typography>{name}</Typography>
        </Stack>
        <Stack>
          <Typography fontWeight="bold">{t('rooms.admin')} : </Typography>
          <Typography>{admin.name}</Typography>
        </Stack>
        <Stack>
          <Typography fontWeight="bold">{t('rooms.description')} : </Typography>
          <Typography>{sanitizeHtml(description)}</Typography>
        </Stack>
        {password && (
          <Stack>
            <Typography>{t('rooms.password')} : </Typography>
            <PasswordCell password={password} />
          </Stack>
        )}
      </Box>
    </Container>
  );
}

export default RoomDetails;
