/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-console */
import { Box, Card, CardContent, Typography } from '@mui/material';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import { sanitizeHtml } from 'utils/helpers';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import YoutubeModal from 'components/common/youtube-modal';
import { useState } from 'react';
import { t } from 'i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type Props = {
  item: ILesson;
  handleEditClick: (data: ILesson) => void;
  // handleDetailsClick: (id: number) => void;
  handleRemoveClick: (id: number) => void;
  handleAddClick: (id: number) => void;
};

function LessonCard({
  // handleDetailsClick,
  handleAddClick,
  handleEditClick,
  handleRemoveClick,
  item,
}: Props) {
  const playVideoUrl = 'assets/images/play-video.png';
  const [openYoutubeModal, setOpenYoutubeModal] = useState(false);
  const videoLink = item.videoUrl;
  const handleCloseYoutubeModal = () => {
    setOpenYoutubeModal(false);
  };

  return (
    <>
      <Card sx={{ position: 'relative', minHeight: '100%' }}>
        {item.videoUrl ? (
          <Box
            onClick={() => setOpenYoutubeModal(true)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <img
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -40%)',
              }}
              src={playVideoUrl}
            />

            {/* <VideoThumbnailGenerator videoUrl={videoLink} /> */}
            <LazyLoadImage
              src={item.thumbnail}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: 200,
                borderRadius: 4,
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
            }}
          >
            <SlowMotionVideoIcon sx={{ fontSize: '100px', color: '#868585' }} />
          </Box>
        )}
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            display="inline"
          >
            {item.title}
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              insetInlineEnd: 4,
              bgcolor: '#fff',
              p: 0.4,
              borderRadius: 5,
              boxShadow: '',
            }}
          >
            <ActionCellButtons
              data={item}
              handleEditClick={handleEditClick}
              handleRemoveClick={(data) => handleRemoveClick(data.id)}
              handleAddClick={(data) => handleAddClick(data.id)}
              addTooltip={t('video-sections.add-section').toString()}
              permissionName="forceAllow"
            />
          </Box>
        </CardContent>
        <CardContent>
          <Typography
            gutterBottom
            variant="body2"
            component="div"
            display="inline"
          >
            {sanitizeHtml(item.description)}
          </Typography>
        </CardContent>

        <CardContent sx={{ display: 'flex', gap: 1 }}>
          <Typography>{t('lessons.videoSectionCount')}</Typography>
          <Typography>{item.videoSectionsCount}</Typography>
        </CardContent>
        <CardContent sx={{ display: 'flex', gap: 1 }}>
          <Typography>{t('lessons.order')}:</Typography>
          <Typography>{item.order}</Typography>
        </CardContent>
      </Card>
      <YoutubeModal
        open={openYoutubeModal}
        handleClose={handleCloseYoutubeModal}
        Link={videoLink}
      />
    </>
  );
}

export default LessonCard;
