import { Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTranslation } from 'react-i18next';
import ExcelSvg from '../../../../../public/assets/svgs/excel2-svgrepo-com.svg';
import AddingSvg from '../../../../../public/assets/svgs/add-svgrepo-com.svg';

type Props = {
  ActionManualQuestion: () => void;
  ActionUploadExcel: () => void;
};
function AddingTypeModal({ ActionManualQuestion, ActionUploadExcel }: Props) {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: '100%' }}>
      <Button type="submit" onClick={ActionManualQuestion}>
        <Box sx={{ display: 'flex', py: 2 }}>
          <LazyLoadImage
            src={AddingSvg}
            style={{
              objectFit: 'cover',
              width: 50,
              height: 50,
              borderRadius: 4,
            }}
          />
          <Typography sx={{ fontSize: '20px', pt: 1, px: 2, color: 'black' }}>
            {t('questionsBank.manualAdding')}
          </Typography>
        </Box>
      </Button>

      <Divider />
      <Button type="submit" onClick={ActionUploadExcel}>
        <Box sx={{ display: 'flex', py: 2 }}>
          <LazyLoadImage
            src={ExcelSvg}
            style={{
              objectFit: 'cover',
              width: 50,
              height: 50,
              borderRadius: 4,
            }}
          />
          <Typography sx={{ fontSize: '20px', pt: 1, px: 2, color: 'black' }}>
            {t('questionsBank.importExcel')}
          </Typography>
        </Box>
      </Button>
    </Box>
  );
}

export default AddingTypeModal;
