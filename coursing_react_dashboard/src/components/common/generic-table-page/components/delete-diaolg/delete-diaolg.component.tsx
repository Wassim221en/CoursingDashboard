/* eslint-disable react/no-unescaped-entities */
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import FadeModal from '../fade-modal/fade-modal.component';

interface IDeleteModalProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  ButtonAcceptClick?: () => void;
  customDescription?: string;
  customTitle?: string;
}

function DeleteDialog({
  setOpen,
  open,
  ButtonAcceptClick,
  customTitle,
  customDescription,
}: IDeleteModalProps) {
  const handleAccept = () => {
    ButtonAcceptClick?.();
    setOpen(false);
  };

  const { t } = useTranslation();

  const title = t('modal.title');

  const description = t('modal.description');

  return (
    <FadeModal setOpen={setOpen!} open={open!} width={500} padding={1} isDialog>
      <Box
        sx={{
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          padding: 1,
          pb: 5,
        }}
      >
        <InfoIcon sx={{ fontSize: 125, margin: '0 auto' }} />
        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            {customTitle || title}
          </Typography>
          <Typography sx={{ color: '#666' }} variant="body1">
            {customDescription || description}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            marginTop: 5,
          }}
        >
          <Button
            sx={{ background: '#c1c1c1' }}
            variant="contained"
            color="warning"
            onClick={() => setOpen(false)}
          >
            {t('modal.cancel')}
          </Button>
          <Button
            sx={{ background: '#E24 ' }}
            variant="contained"
            color="error"
            onClick={handleAccept}
          >
            {t('modal.confirm')}
          </Button>
        </Box>
      </Box>
    </FadeModal>
  );
}

export default DeleteDialog;
