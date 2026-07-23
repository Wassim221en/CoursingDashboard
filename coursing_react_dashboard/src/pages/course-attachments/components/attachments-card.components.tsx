/* eslint-disable no-console */
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { IAttachments } from 'apis/attachments/attachments.interfaces';
import { getFileType } from 'utils/helpers';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import attachmentsApi from 'apis/attachments/attachments.api';
import { showSuccess } from 'libs/react.toastify';
import DeleteDialog from 'components/common/generic-table-page/components/delete-diaolg/delete-diaolg.component';
import { useTranslation } from 'react-i18next';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';

type Props = {
  item: IAttachments;
  handleEditClick: (data: IAttachments) => void;
};

function AttachmentsCard({
  handleEditClick,

  item,
}: Props) {
  const { t } = useTranslation();
  const { id, title, fileUrl = '' } = item;
  const { fileType, icon: fileIcons } = getFileType(fileUrl);

  const [openModal, setOpenModal] = useState(false);
  const [showProgressSpinner, setShowProgressSpinner] = useState(false);

  const queryClient = useQueryClient();

  const handleRemoveAttachment = async () => {
    setShowProgressSpinner(true);
    try {
      await attachmentsApi.removeAttachments(id!);
      queryClient.invalidateQueries(['get-attachments']);
      setShowProgressSpinner(false);
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowProgressSpinner(false);
    }
  };

  return (
    <>
      <Card>
        {fileType === 'Image_File' ? (
          <CardMedia
            sx={{
              aspectRatio: '1 / 1',
            }}
            component="img"
            image={fileUrl}
            alt={`${title} cover`}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '367px',
            }}
            textAlign="center"
          >
            <Link to={fileUrl} target="_blank">
              <Box>{fileIcons}</Box>
              <Typography
                gutterBottom
                variant="body2"
                fontSize={12}
                component="div"
              >
                {fileType}
              </Typography>
            </Link>
          </Box>
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Box display="flex">
            <ActionCellButtons
              data={null}
              permissionName="forceAllow"
              handleEditClick={() => handleEditClick(item)}
              handleRemoveClick={() => setOpenModal(true)}
              showDeletingSpinner={!!showProgressSpinner}
            />

            <Link to={fileUrl} target="_blank">
              <Tooltip title="View File">
                <IconButton color="warning">
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </Link>
            <Link to={fileUrl} target="_self" download>
              <Tooltip title="download File">
                <IconButton color="info">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Box>
        </CardActions>
      </Card>
      <DeleteDialog
        open={openModal}
        setOpen={setOpenModal}
        ButtonAcceptClick={handleRemoveAttachment}
      />
    </>
  );
}

export default AttachmentsCard;
