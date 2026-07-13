import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { IInstructorCertificate } from 'apis/instructor/instructor.interfaces';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import { getImageServerLink } from 'utils/helpers';

type Props = {
  item: IInstructorCertificate;
  handleEditClick: (data: IInstructorCertificate) => void;
  handleRemoveClick: (id: number) => void;
};

function InstructorCertificateCard({
  handleEditClick,
  handleRemoveClick,
  item,
}: Props) {
  const { id, name, date, fileUrl, source } = item;

  return (
    <Card>
      <CardMedia
        sx={{
          aspectRatio: '16 / 9',
        }}
        component="img"
        image={getImageServerLink(fileUrl)}
        alt={`${name}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {new Date(date).toLocaleDateString()}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {source}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <ActionCellButtons
            data={null}
            handleEditClick={() => handleEditClick(item)}
            handleRemoveClick={() => handleRemoveClick(Number(id))}
            permissionName="Instructor"
          />
        </Box>
      </CardActions>
    </Card>
  );
}

export default InstructorCertificateCard;
