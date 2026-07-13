import { Box, SxProps, Typography } from '@mui/material';
import { IQuestionBank } from 'apis/qusetions/questions.interfaces';
import { QuestionLevel, QuestionType } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { sanitizeHtml, truncateString } from 'utils/helpers';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useTranslation } from 'react-i18next';

const CARD: SxProps = {
  px: 2,
  py: 2,
  m: 3,
  display: 'flex',
  gap: 1,
  flexShrink: 0,
  textAlign: 'end',
  boxShadow: 3,
  bgcolor: '#f6f6f6',
  borderRadius: '12px',
};

type Props = {
  question: IQuestionBank;
  onClick: () => void;
};

function QusetionCard({ question, onClick }: Props) {
  const { i18n } = useTranslation();
  return (
    <Box sx={CARD} justifyContent="space-between">
      <Box>
        <Typography fontWeight={600} fontSize={18}>
          {truncateString(sanitizeHtml(question.title), 50)}
        </Typography>
        <Typography fontWeight={400} fontSize={12}>
          {getNameById(QuestionType, String(question))}
        </Typography>
        <Typography fontWeight={400} fontSize={12}>
          {getNameById(QuestionLevel, String(question.questionLevel))}
        </Typography>
        {/* <TextField
          sx={{ width: '75px', mt: 2, bgcolor: '#fff' }}
          type="number"
          label="Mark"
          variant="outlined"
          value={mark}
          onChange={(e) => setMark(Number(e.target.value))}
        /> */}
      </Box>
      {i18n.language === 'ar' ? (
        <KeyboardDoubleArrowLeftIcon
          fontSize="medium"
          sx={{ cursor: 'pointer' }}
          onClick={onClick}
        />
      ) : (
        <KeyboardDoubleArrowRightIcon
          fontSize="medium"
          sx={{ cursor: 'pointer' }}
          onClick={onClick}
        />
      )}
    </Box>
  );
}

export default QusetionCard;
