/* eslint-disable no-console */
import {
  Box,
  Card,
  Rating,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import { ICourse } from 'apis/course/course.interfaces';
import { getImageServerLink } from 'utils/helpers';
import { useTranslation } from 'react-i18next';
import courseApi from 'apis/course/course.api';
import { showSuccess } from 'libs/react.toastify';
import DeleteDialog from 'components/common/generic-table-page/components/delete-diaolg/delete-diaolg.component';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';

type Props = {
  item: ICourse;
  handleEditClick: (data: ICourse) => void;
  handleCourseDetailsClick: (id: number) => void;
  controllerName: IWebContentEnName;
};

function CourseCard({
  handleEditClick,
  handleCourseDetailsClick,
  item,
  controllerName,
}: Props) {
  const { id, rating, title, coverUrl = '' } = item;
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [showProgressSpinner, setShowProgressSpinner] = useState(false);

  const queryClient = useQueryClient();

  const handleRemoveCourse = async () => {
    setShowProgressSpinner(true);
    try {
      await courseApi.removeCourse(id);
      showSuccess(t('common.dataDeletedSuccessfully'));
      queryClient.invalidateQueries(['get-courses']);
      setShowProgressSpinner(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowProgressSpinner(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          maxWidth: '200px',
        }}
      >
        <Box>
          <CardMedia
            sx={{
              aspectRatio: '1 / 1',
            }}
            component="img"
            image={getImageServerLink(coverUrl) || '/assets/images/book.png'}
            alt={`${title} cover`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Box>
              <Rating
                name="half-rating"
                defaultValue={rating}
                precision={0.5}
                readOnly
              />
            </Box>
          </CardContent>
        </Box>
        <Box>
          <CardActions
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Button size="small" onClick={() => handleCourseDetailsClick(id)}>
                {t('courses.courseDetails')}
              </Button>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box>
                <ActionCellButtons
                  data={null}
                  permissionName={controllerName}
                  handleEditClick={() => handleEditClick(item)}
                  handleRemoveClick={() => setOpenModal(true)}
                  showDeletingSpinner={!!showProgressSpinner}
                />
              </Box>
            </Box>
          </CardActions>
        </Box>
      </Card>
      <DeleteDialog
        open={openModal}
        setOpen={setOpenModal}
        ButtonAcceptClick={handleRemoveCourse}
      />
    </>
  );
}

export default CourseCard;
