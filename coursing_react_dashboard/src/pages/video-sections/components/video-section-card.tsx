import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import {
  ITimeOfBegin,
  IVideoSection,
} from 'apis/video-sections/video-sections.interface';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import React from 'react';
import { getImageServerLink } from 'utils/helpers';

type Props = {
  videoSection: IVideoSection;
  handleEditClick: (data: IVideoSection) => void;
  handleRemoveClick: (id: number) => void;
  endTime?: ITimeOfBegin;
};

function VideoSectionCard({
  videoSection,
  handleEditClick,
  handleRemoveClick,
  endTime,
}: Props) {
  return (
    <Card>
      <CardMedia
        image={getImageServerLink(videoSection.imageUrl)}
        sx={{
          width: '100%',
          aspectRatio: '1/1',
        }}
      />
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box dir="ltr">
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            display="inline"
          >
            {videoSection.title}
          </Typography>
          <Box display="flex" gap={1}>
            <Typography>
              {videoSection.timeOfBegin.houres}:
              {videoSection.timeOfBegin.minutes}:
              {videoSection.timeOfBegin.seconds}
            </Typography>
            <Typography>to</Typography>
            {endTime ? (
              <Typography>
                {endTime.houres}:{endTime.minutes}:{endTime.seconds}
              </Typography>
            ) : (
              <Typography>end</Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <ActionCellButtons
            data={videoSection}
            handleEditClick={handleEditClick}
            handleRemoveClick={(data) => handleRemoveClick(data.id)}
            permissionName="forceAllow"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default VideoSectionCard;
