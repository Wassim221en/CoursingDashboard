import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { IAds } from 'apis/ads/ads.interfaces';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import { AdsType } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  ads: IAds;
  handleEditClick: (data: IAds) => void;
  handleRemoveClick: (id: number) => void;
};

function AdsCard({ ads, handleEditClick, handleRemoveClick }: Props) {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        height: '100%',
      }}
    >
      <CardMedia
        image={ads.coverImageUrl}
        sx={{
          width: '100%',
          aspectRatio: '16 / 9',
        }}
      />
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            display="inline"
          >
            {ads.name}
          </Typography>
          <Typography>{ads.description}</Typography>
          <Typography>
            {getNameById(
              AdsType.map((a) => ({ id: a.id, name: t(`ads-form.${a.name}`) })),
              String(ads.type),
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <ActionCellButtons
            permissionName="Ads"
            data={ads}
            handleEditClick={handleEditClick}
            handleRemoveClick={(data) => handleRemoveClick(data.id)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default AdsCard;
