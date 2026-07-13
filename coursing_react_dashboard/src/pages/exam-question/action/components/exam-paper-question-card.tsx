/* eslint-disable react/no-array-index-key */
import { CropSquare } from '@mui/icons-material';
import { Box, TextField, Typography, SxProps, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import parse from 'html-react-parser';
import CellImage from 'components/common/cell-image/cell-image.component';
import { getImageServerLink } from 'utils/helpers';
import { TQuestionState } from '../action';

type Props = {
  question: TQuestionState;
  styles: SxProps;
  onMarkChange: (question: TQuestionState) => void;
  onRemove: (questionId: number) => void;
  onDelete: (questionId: number) => void;
  choicesGrid: number;
  paperLang: number;
  questionNum: number;
};

function ExamPaperQuestionCard({
  styles,
  question,
  onMarkChange,
  onRemove,
  onDelete,
  choicesGrid,
  paperLang,
  questionNum,
}: Props) {
  // console.log('🚀 ~ styles:', styles);
  // const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  return (
    <Box
      key={question.questionId}
      sx={styles}
      // onClick={() => setShowDeleteBtn(!showDeleteBtn)}
    >
      <Box>
        <Box sx={{ display: 'flex', gap: 0.2 }}>
          <Typography sx={{ fontSize: 22, pt: 0.5, marginInlineEnd: 1 }}>
            {String(questionNum).concat('-')}
          </Typography>
          <Typography sx={styles}>{parse(question.body || '')}</Typography>
        </Box>
        <Box
          display="flex"
          width="100%"
          justifyContent="space-between"
          textAlign="start"
        >
          <Typography sx={styles}>{parse(question.title)}</Typography>

          <DeleteIcon
            className="hide-on-print"
            sx={{
              zIndex: 999,
              cursor: 'pointer',
              mx: 2,
            }}
            color="error"
            onClick={() => {
              onRemove(Number(question.questionId));
              onDelete(Number(question.examQuestionId));
            }}
          />
          <TextField
            className="hide-on-print"
            sx={{
              maxWidth: '55px',
              height: '20px',
              fontSize: '1px',

              bgcolor: '#fff',
            }}
            size="small"
            type="tel"
            placeholder="mark"
            defaultValue={question.examQuestionMark || 0}
            InputProps={{
              inputProps: { min: 0, max: 600 },
            }}
            variant="outlined"
            // value={question.examQuestionMark || 0}
            onChange={(e) => {
              onMarkChange({
                ...question,
                examQuestionMark: Number(e.target.value),
              });
            }}
          />
        </Box>
      </Box>
      <Box key={Math.random() * Date.now()}>
        <Grid container>
          {question.questionType === 3 ? (
            <>
              <Grid item md={6}>
                <Typography mt={2} px={2} fontSize={15}>
                  <PanoramaFishEyeIcon fontSize="inherit" />{' '}
                  {paperLang === 0 ? 'True' : 'صح'}
                </Typography>
              </Grid>
              <Grid>
                <Typography mt={2} px={2} fontSize={15}>
                  <PanoramaFishEyeIcon fontSize="inherit" />{' '}
                  {paperLang === 0 ? 'False' : 'خطأ'}
                </Typography>
              </Grid>
            </>
          ) : (
            question?.choices?.map((choice, index) => (
              <Grid item md={choicesGrid} key={index * Date.now()}>
                <Typography mt={2} px={2} fontSize={15}>
                  <CropSquare fontSize="inherit" /> {choice.title}
                </Typography>
              </Grid>
            ))
          )}
        </Grid>
        {!!question.imageUrl?.length && (
          <CellImage cropRatio={16 / 9} imageSrc={question.imageUrl || ''} />
        )}
      </Box>
    </Box>
  );
}

export default ExamPaperQuestionCard;
