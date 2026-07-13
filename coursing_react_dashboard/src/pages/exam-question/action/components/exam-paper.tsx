/* eslint-disable no-nested-ternary */
import { Box, Button, Typography } from '@mui/material';
import { generateFriendlyDate } from 'utils/helpers';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import specializedQueries from 'apis/specialized/specialized.queries';
import routesNames from 'routes/constants';
import gradeQueries from 'apis/grade/grade.queries';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import ExamPaperQuestionCard from './exam-paper-question-card';
import { ExamPaperProps } from './types';

function ExamPaper({
  onRemove,
  onDelete,
  onMarkChange,
  questions = [],
  paperMainTitle,
  paperMainTitleFontStyle,
  paperBodyStyle,
  showPaperInfo,
  paperLang,
  examTime,
  choicesGrid,
  isLoadingExamDetails,
}: ExamPaperProps) {
  const { i18n, t } = useTranslation();

  const lang = i18n.language;

  const { pathname = '' } = useLocation();

  const UniversityExamPaper = pathname.includes(
    routesNames.universityExamQuestions,
  );

  const ShoolExamPaper = pathname.includes(routesNames.schoolExamQuestions);

  const SpecializedExamPaper = pathname.includes(
    routesNames.specializeExamQuestions,
  );

  const subjectId = useSearchParams('subject');

  const { data: collegeSubject } =
    collegeSubjectQueries.useCollegeSubjectDetailsUnitQuery(
      subjectId,
      UniversityExamPaper,
    );

  const { data: gradeSubject } = gradeQueries.useGradeSubjectDetailsQuery(
    subjectId,
    ShoolExamPaper,
  );

  const { data: specializedSubject } =
    specializedQueries.useSpecializedDetailsQuery(
      subjectId,
      !!SpecializedExamPaper,
    );

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current as any,
  });

  return (
    <Box
      sx={{
        p: 2,
        height: '100%',
        border: 1,
        direction:
          lang === 'ar' && paperLang === 1
            ? 'ltr'
            : lang === 'en' && paperLang === 1
            ? 'rtl'
            : lang === 'en' && paperLang === 0
            ? 'ltr'
            : 'rtl',
      }}
      ref={componentRef}
    >
      <Box borderBottom={1} pb={2}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={paperMainTitleFontStyle}>{paperMainTitle}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          {paperLang === 0 ? (
            <>
              <Box px={0}>
                {showPaperInfo.ShowName && (
                  <Typography
                    fontWeight={500}
                    mt={2}
                    px={paperLang === 0 ? 0 : 5}
                    sx={{
                      fontWeight: 600,
                      fontSize: showPaperInfo.fontSize,
                      textAlign: 'start',
                    }}
                  >
                    Name
                  </Typography>
                )}
                {showPaperInfo.showExamTime && (
                  <Typography
                    fontWeight={600}
                    mt={2}
                    sx={{ fontWeight: 600, fontSize: showPaperInfo.fontSize }}
                  >
                    {`Total Time : ${examTime?.length ? examTime : '0'} minute`}
                  </Typography>
                )}
              </Box>
              <Box>
                {showPaperInfo.ShowSubject && (
                  <Typography
                    fontWeight={500}
                    mt={2}
                    pr={3}
                    sx={{
                      fontWeight: 600,
                      fontSize: showPaperInfo.fontSize,
                      textAlign: 'end',
                    }}
                  >
                    {`Subject :  ${
                      UniversityExamPaper
                        ? collegeSubject?.name
                        : ShoolExamPaper
                        ? gradeSubject?.subject.name
                        : specializedSubject?.name
                    }`}
                  </Typography>
                )}
                {showPaperInfo.showExamDate && (
                  <Box display="flex">
                    {showPaperInfo.Date.length ? (
                      <Typography
                        mt={2}
                        sx={{ fontSize: showPaperInfo.fontSize }}
                      >
                        {generateFriendlyDate(String(showPaperInfo.Date)) ??
                          Date.now()}{' '}
                      </Typography>
                    ) : (
                      ''
                    )}
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <>
              <Box px={5}>
                {showPaperInfo.ShowName && (
                  <Typography
                    fontWeight={500}
                    mt={2}
                    sx={{
                      fontWeight: 600,
                      fontSize: showPaperInfo.fontSize,
                    }}
                  >
                    الاسم :
                  </Typography>
                )}
                {showPaperInfo.showExamTime && (
                  <Box
                    fontWeight={600}
                    mt={2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontWeight: 600,
                      fontSize: showPaperInfo.fontSize,
                    }}
                  >
                    <Typography>الوقت:</Typography>
                    <Typography>{examTime?.length ? examTime : '0'}</Typography>
                  </Box>
                )}
              </Box>
              <Box>
                {showPaperInfo.ShowSubject && (
                  <Typography
                    fontWeight={500}
                    mt={2}
                    px={1}
                    sx={{
                      fontWeight: 600,
                      fontSize: showPaperInfo.fontSize,
                      textAlign: 'end',
                    }}
                  >
                    {`المادة  : ${
                      UniversityExamPaper
                        ? collegeSubject?.name
                        : ShoolExamPaper
                        ? gradeSubject?.subject.name
                        : specializedSubject?.name
                    }`}
                  </Typography>
                )}
                {showPaperInfo.showExamDate && (
                  <Box display="flex">
                    {showPaperInfo.Date.length ? (
                      <Typography
                        mt={2}
                        sx={{ fontSize: showPaperInfo.fontSize }}
                      >
                        {generateFriendlyDate(String(showPaperInfo.Date)) ??
                          Date.now()}{' '}
                      </Typography>
                    ) : (
                      ''
                    )}
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
      {isLoadingExamDetails ? (
        <LoadingPlaceholder />
      ) : (
        <Box mt={2} px={2} sx={{ minHeight: '83vh' }}>
          {questions.map((question, idx) => (
            <ExamPaperQuestionCard
              styles={paperBodyStyle}
              question={question}
              key={question.questionId + question.title}
              onMarkChange={onMarkChange}
              onRemove={onRemove}
              onDelete={onDelete}
              choicesGrid={choicesGrid}
              paperLang={paperLang}
              questionNum={idx + 1}
            />
          ))}
        </Box>
      )}
      <Box sx={{ borderTop: 1 }}>
        <Typography textAlign="center" mt={1}>
          {showPaperInfo.PageNumber}
        </Typography>

        <Button className="hide-on-print" onClick={handlePrint}>
          {t('salesPoints.print')}
        </Button>
      </Box>
    </Box>
  );
}

export default ExamPaper;
