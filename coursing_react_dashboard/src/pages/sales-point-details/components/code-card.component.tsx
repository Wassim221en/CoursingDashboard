import { PinDrop } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import ThemeVariables from 'theme/theme-variables';

type Props = {
  code: string;
  points: number;
  address?: string;
};
function CodeCardComponent({ code, points, address }: Props) {
  const { t, i18n } = useTranslation();
  return (
    <div
      style={{
        pageBreakInside: 'avoid',
        height: 'calc(20vh - 4mm)',
        overflow: 'hidden',
        margin: '2mm',
      }}
    >
      <Box
        sx={{
          '& p': {
            color: ThemeVariables.PRIMARY_COLOR,
            fontFamily: 'sans-serif',
          },
          border: '2px solid',
          borderColor: ThemeVariables.PRIMARY_COLOR,
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <img
          alt=""
          style={{
            position: 'absolute',
            objectFit: 'contain',
            translate: '-50% 0',
            top: 0,
            bottom: 0,
            height: '100%',
            zIndex: -1,
          }}
          src="/assets/images/sales-card-logo.png"
        />
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 'bold',
            position: 'absolute',
            top: '2.6rem',
            insetInlineStart: '0.3rem',
            fontStyle: 'italic',
            opacity: 0.5,
          }}
        >
          {points % 1000 === 0 ? (points / 1000).toString() : points.toString()}
        </Typography>
        <Typography
          sx={{
            fontSize: i18n.language === 'ar' ? 20 : 14,
            fontWeight: 'bold',
            position: 'absolute',
            top: '4.5rem',
            insetInlineStart: '0.32rem',
            fontStyle: 'italic',
          }}
        >
          {t('salesPoints.thousand')}
        </Typography>
        {address && (
          <Typography
            fontSize={14}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1mm',
              fontSize: 10,
              position: 'absolute',
              inset: 'auto',
              insetInlineEnd: '0.1rem',
              bottom: '0.1rem',
            }}
          >
            <span>{address}</span>
            <PinDrop style={{ fontSize: 'inherit' }} />
          </Typography>
        )}
        <Box
          sx={{
            position: 'absolute',
            inset: '1vh',
            insetInlineStart: '30%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            alt=""
            style={{
              height: '1.5rem',
              objectFit: 'contain',
              marginBottom: '0.2rem',
            }}
            src="/assets/images/sales-card-logo-h.png"
          />
          <Typography
            sx={{
              border: '1px solid',
              borderColor: ThemeVariables.PRIMARY_COLOR,
              borderRadius: 5,
              paddingInline: 1,
              fontSize: 10,
              unicodeBidi: 'plaintext',
            }}
          >
            اكتب الرمز أو امسح QR
          </Typography>
          <Typography
            sx={{
              border: '1px solid',
              borderColor: ThemeVariables.PRIMARY_COLOR,
              fontStyle: 'italic',
              paddingInline: 1,
              marginTop: '-1px',
              whiteSpace: 'pre',
              letterSpacing: '3px',
              fontSize: 15,
              // minWidth: '150px',
              marginX: 'auto',
            }}
          >
            {code}
          </Typography>
          <QRCode
            size={90}
            value={code}
            bgColor="#fff"
            style={{ flexGrow: 1 }}
          />
        </Box>
      </Box>
    </div>
  );
}

export default CodeCardComponent;
