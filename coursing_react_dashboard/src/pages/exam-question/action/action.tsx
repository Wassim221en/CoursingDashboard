/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, SxProps, Tab, Tabs } from '@mui/material';
import {
  IQuestionBank,
  IQuestionBankPayload,
  IQuestionBankPayloadForm,
  IUploadExcelPayload,
  QuestionTypeEnum,
} from 'apis/qusetions/questions.interfaces';
import { IExamQuestionPayload } from 'apis/exam/exam.interfaces';
import PageTitle from 'components/common/generic-table-page/components/page-title/page-title.component';
import examApi from 'apis/exam/exam.api';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import collegeUnitQueries from 'apis/college-unit/college-unit.queries';
import schoolUnitQueries from 'apis/school-unit/school-unit.queries';
import { showSuccess } from 'libs/react.toastify';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import NoData from 'components/common/no-data/no-data.component';
import AddCard from 'components/common/add-card/add-card.component';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import routesNames from 'routes/constants';
import { HashLoader } from 'react-spinners';
import QuestionApi from 'apis/qusetions/questions.api';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import QuestionBankForm from 'components/forms/questions-bank/question-bank.form';
import examQueries from 'apis/exam/exam.queries';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import { useTranslation } from 'react-i18next';
import prepareUploadExcelFormData from 'components/forms/questions-bank/helper/prepare-upload-excel-form-data';
import ProtectPage from 'components/common/protect-page/protectPage';
import specializedQueries from 'apis/specialized/specialized.queries';
import { motion } from 'framer-motion';
import QuestionBankUploadExcelForm from 'components/forms/questions-bank/qusetion-bank-upload-excel.form';
import NotFoundPage from 'pages/error-pages/not-found.page';
import prepareBankQuestion from 'pages/question-bank/helpers/prepare-bank-question-form-data';
import ExamPaper from './components/exam-paper';
import ExamPaperSetting from './components/exam-paper-settings';
import {
  initialMainTitleFontStyle,
  initialPaperBodyStyle,
  initialPaperInfoDisplay,
} from './components/exam-Paper-initial-states';
import ExamUnitCollapse from './components/exam-unit-collapse';

export type TExamUnitState = Omit<ICollegeUnit, 'collegeSubject'>;
export type TQuestionState = IQuestionBank & { unitId?: number | null };

function QuestionActionPage() {
  const { t } = useTranslation();

  // vars to know if hte page for universities or schools from the pathname
  const { pathname = ' ' } = useLocation();
  const navigate = useNavigate();

  const isUniversity = pathname.includes(routesNames.universityExamQuestions);
  const isSchool = pathname.includes(routesNames.schoolExamQuestions);
  const isSpecialize = pathname.includes(routesNames.specializeExamQuestions);

  // getting subject id from route
  const examId = useSearchParams('exam');
  const subjectId = useSearchParams('subject');

  // main states to store questions
  const [allExamUnits, setAllExamUnits] = useState<TExamUnitState[]>([]);
  const [stagedQuestions, setStagedQuestions] = useState<TQuestionState[]>([]);

  const [directQuestions, setdirectQuestions] = useState<TQuestionState[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fade Modal
  const [openQuestionBankModal, setOpenQuestionBankModal] = useState(false);

  // styles & settings states
  const [paperLang, setPaperLang] = useState(1);
  const [choicesGrid, setChoicesGrid] = useState(6);
  const [paperMainTitle, setPaperMainTitle] = useState<string>('');
  const [showPaperInfo, setShowPaperInfo] = useState(initialPaperInfoDisplay);
  const [paperMainTitleFontStyle, setPaperMainTitleFontStyle] =
    useState<SxProps>(initialMainTitleFontStyle);
  const [paperBodyStyle, setPaperBodyStyle] = useState<SxProps>(
    initialPaperBodyStyle,
  );

  // Api Queries

  const { data: exam, isLoading: isLoadingExamDetails } =
    examQueries.useExamDetailsQuery(examId);

  const {
    data: collegeSubjectsUnits,
    isFetching: isLoadingCollegeSubjectsUnits,
    refetch: collegeRefetch,
  } = collegeUnitQueries.useUnitsQuery(
    {
      collegeDetailsSubjectId: isUniversity ? subjectId : null,
    },
    Boolean(!isUniversity),
  );

  const {
    data: SchoolSubjectUnits,
    isLoading: isLoadingSchoolSubjectsUnits,
    refetch: SchoolRefetch,
  } = schoolUnitQueries.useGradeSubjectUnitsQuery(
    {
      gradeSubjectId: isSchool ? subjectId : null,
    },
    Boolean(isSchool),
  );

  const {
    data: specializeQuestions,
    isLoading: isLoadingSpecializeQuestions,
    refetch: specializeRefetch,
  } = specializedQueries.useSpecializedQuestionQuery(!!isSpecialize);

  const isLoading =
    (isUniversity && isLoadingCollegeSubjectsUnits) ||
    (isSchool && isLoadingSchoolSubjectsUnits) ||
    (isSpecialize && isLoadingSpecializeQuestions);

  useEffect(() => {
    if (collegeSubjectsUnits?.data?.length)
      setAllExamUnits(collegeSubjectsUnits.data);
    else if (SchoolSubjectUnits?.data?.length)
      setAllExamUnits(SchoolSubjectUnits.data);
    else if (specializeQuestions?.data?.length)
      setAllExamUnits(
        specializeQuestions.data.filter((f) => f.id === subjectId),
      );

    const TempData = exam?.questions;

    setStagedQuestions(TempData ?? []);
  }, [
    collegeSubjectsUnits?.data,
    SchoolSubjectUnits?.data,
    specializeQuestions?.data,
    !isLoadingExamDetails,
  ]);
  const [progress, setProgress] = useState<number>();
  const abortHandler = useRef<any>();

  const handleQuestionAction = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    { data, files }: TSubmitHandlerData<IQuestionBankPayloadForm>,
  ) => {
    const payloadData: IQuestionBankPayload = {
      ...data,

      collegeDetailsSubjectId: data.collegeDetailsSubjectId?.id || null,
      collegeDetailsSubjectUnitIds: data.collegeSubjectUnitIds?.length
        ? data.collegeSubjectUnitIds?.map((collegeUnit) => collegeUnit.id)
        : null,
      collegeId: data.collegeId?.id || null,
      questionLevel: data.questionLevel?.id || null,
      questionType: data.questionType?.id,
      trueFalseAnswer:
        data.questionType?.id === QuestionTypeEnum.TrueAndFalse
          ? !!data.trueFalseAnswer
          : null,
      specialityId: data.specialityId?.id || null,
      gradeSubjectId: data.gradeSubjectId?.id || null,
      gradeId: data.gradeId?.id || null,
      gradeSubjectUnitIds: data.gradeSubjectUnitIds?.length
        ? data.gradeSubjectUnitIds?.map((schoolUnit) => schoolUnit.id)
        : null,
      choices:
        data.questionType?.id === QuestionTypeEnum.MultiChoice
          ? data.choices?.map((choice) => ({
              title: choice.title,
              theTrueAnswer: choice.theTrueAnswer,
            }))
          : [],
    };
    console.log('🚀 ~ handleQuestionAction ~ data:', payloadData);

    try {
      const formData = prepareBankQuestion.prepareBankQuestionFormData({
        data: payloadData,
        files,
      });
      await QuestionApi.addQuestion(formData, onProgress, (handler) => {
        abortHandlerRef.current = handler;
      });
      if (collegeSubjectsUnits?.data?.length) {
        collegeRefetch();
        setAllExamUnits(collegeSubjectsUnits.data);
      } else if (SchoolSubjectUnits?.data?.length) {
        SchoolRefetch();
        setAllExamUnits(SchoolSubjectUnits.data);
      } else if (specializeQuestions?.data?.length) {
        specializeRefetch();
        setAllExamUnits(
          specializeQuestions.data.filter((f) => f.id === subjectId),
        );
      }

      showSuccess(t('common.dataAddedSuccessfully'));
      setOpenQuestionBankModal(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  // handle adding exam question (post api)
  const handleExamQuestionAction = async () => {
    const payloadData: IExamQuestionPayload = {
      examId,
      pastQuestions: stagedQuestions
        .filter((q) => q.questionId && q.questionId >= 1)
        .map((i) => ({
          questionId: i.questionId,
          mark: i.examQuestionMark || 0,
        })),

      questions: directQuestions.map((item) => ({
        title: item.title,
        body: item.body,
        collegeDetailsSubjectId: isUniversity
          ? item.collegeDetailsSubjectId?.id
          : null,
        collegeDetailsSubjectUnitIds: isUniversity
          ? item.collegeDetailsSubjectUnitId?.map(
              (CollegeUnit) => CollegeUnit.id,
            )
          : null,
        questionLevel: item.questionLevel,
        questionType: item.questionType,
        note: item.note,
        examQuestionMark: item.examQuestionMark,
        gradeSubjectId: isSchool ? item.gradeSubjectId?.id : null,
        specialityId: item.specialityId?.id,
        trueFalseAnswer: item.trueFalseAnswer,
        gradeSubjectUnitIds: isSchool
          ? item.gradeSubjectUnitId?.map((gradeUnit) => gradeUnit.id) || null
          : null,
        choices: item.choices?.map((choice) => ({
          title: choice.title,
          theTrueAnswer: choice.theTrueAnswer,
        })),
        tags: item.questionTags.map((tag) => ({
          id: 0,
          name: tag.name,
        })),
      })),
    };
    try {
      await examApi.addExamQuestion(payloadData);
      showSuccess(t('common.dataAddedSuccessfully'));
      navigate(-1);
      return setIsSubmitting(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      return setIsSubmitting(false);
    }
  };

  // handle remove question api
  const handleRemoveExamQuestion = async (examQuestionId: number) => {
    if (examQuestionId > 0)
      try {
        await examApi.removeExamQuestion(examQuestionId);
        showSuccess(t('common.dataDeletedSuccessfully'));
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
  };

  // functions for handling stage and upstage questions
  const handleStageQuestion = (question: TQuestionState) => {
    setStagedQuestions((prev) => [...prev, question]);
  };

  const handleRemoveStagedQusetion = (questionId: number) => {
    setStagedQuestions((pre) => [
      ...pre.filter((f) => f.questionId !== questionId),
    ]);
  };

  const handleMarkChange = (question: TQuestionState) => {
    const newQuestions = structuredClone(stagedQuestions);

    const index = newQuestions.findIndex(
      (q) => q.questionId === question.questionId,
    );

    newQuestions[index] = question;

    setStagedQuestions(newQuestions);

    const newDirectQuestions = directQuestions;

    const indexo = newDirectQuestions.findIndex(
      (c) => c.questionId === question.questionId,
    );

    newDirectQuestions[indexo] = question;

    setdirectQuestions(newDirectQuestions);
  };

  const handleAddDirectQuestion = ({
    data,
  }: TSubmitHandlerData<IQuestionBankPayloadForm>) => {
    setStagedQuestions((prev) => [
      ...prev,
      {
        ...data,
        questionId: -1 * directQuestions.length,
        trueFalseAnswer: !!data.trueFalseAnswer,
        collegeDetailsSubjectUnitId:
          (data?.collegeSubjectUnitIds as unknown as ICollegeUnit[]) || null,
        gradeSubjectUnitIds:
          (data?.gradeSubjectUnitIds as unknown as TAutoComplete) || null,
        note: data?.note,
        schoolSubjectId: data?.schoolSubjectId,
        questionType: data?.questionType.id,
        questionLevel: data?.questionLevel.id,
        questionTags: data.tags.map((tag) => ({
          id: 0,
          name: tag.name,
        })),
      },
    ]);
    setdirectQuestions((prev) => [
      ...prev,
      {
        ...data,
        questionId: -1 * directQuestions.length,
        trueFalseAnswer: !!data.trueFalseAnswer,
        collegeDetailsSubjectUnitId:
          data.collegeSubjectUnitIds as unknown as ICollegeUnit[],
        gradeSubjectUnitIds:
          data.gradeSubjectUnitIds as unknown as TAutoComplete,
        title: data.title,
        note: data.note,
        schoolSubjectId: data.schoolSubjectId,
        questionType: data.questionType.id,
        questionLevel: data.questionLevel.id,
        questionTags: data.tags.map((tag) => ({
          id: 0,
          name: tag.name,
        })),
      },
    ]);
    setOpenQuestionBankModal(false);
  };

  const handleUploadExcel = async ({
    data,
    files,
  }: TSubmitHandlerData<IQuestionBankPayloadForm>) => {
    const Parameters: IUploadExcelPayload = {
      ...data,
      collegeDetailsSubjectId: data.collegeDetailsSubjectId?.id || null,
      gradeSubjectId: data.gradeSubjectId?.id || null,
      specializedId: data.specialityId?.id || null,
      collegeId: null,
      examId,
    };
    try {
      const FormData = prepareUploadExcelFormData({
        files,
      });
      const uploadExcelResponse = await QuestionApi.uploadExcelFile(
        Parameters,
        FormData,
      );
      showSuccess(
        t('common.addSuccess', { var: t('questionsBank.excelFile') }),
      );
      setStagedQuestions((prev) => [...prev, ...uploadExcelResponse]);
      setOpenQuestionBankModal(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  // fill states when data change

  // filter units to remove staged units and empty units
  const filteredExamUnits = allExamUnits.map((unit) => {
    const filteredUnit: TExamUnitState = {
      ...unit,
      questions: unit?.questions?.filter(
        (q) =>
          !stagedQuestions?.some(
            (question) => question?.questionId === q.questionId,
          ),
      ),
    };
    return filteredUnit;
  });

  const noData = !filteredExamUnits.length && !isLoading;

  // swiper states
  const [activeTab, setActiveTab] = useState(0);
  const [questionModalActiveTab, setQuestionModalActiveTab] = useState(0);

  if (!subjectId || !examId) return <NotFoundPage />;

  return (
    <>
      <PageTitle title={t('questionsBank.questions')} />
      <Box>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={6} mt={5} order={2}>
            <ExamPaper
              paperMainTitle={paperMainTitle}
              paperBodyStyle={paperBodyStyle}
              paperMainTitleFontStyle={paperMainTitleFontStyle}
              onMarkChange={(param) => handleMarkChange(param)}
              showPaperInfo={showPaperInfo}
              paperLang={paperLang}
              onRemove={handleRemoveStagedQusetion}
              onDelete={handleRemoveExamQuestion}
              questions={stagedQuestions}
              examTime={exam?.examTime}
              choicesGrid={choicesGrid}
              isLoadingExamDetails={isLoadingExamDetails}
            />
          </Grid>
          <Grid item xs={6}>
            <Box mx="30%">
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
              >
                <Tab value={1} label={t('common.settings')} />
                <Tab value={0} label={t('questionsBank.questions')} />
              </Tabs>
            </Box>

            {activeTab === 0 ? (
              <motion.div
                animate={{
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                }}
              >
                <Box
                  sx={{ height: '100vh', width: '100%', overflowY: 'scroll' }}
                >
                  {noData && <NoData />}
                  {isLoading && filteredExamUnits.length === 0 && (
                    <LoadingPlaceholder />
                  )}
                  {filteredExamUnits.map((unit) => (
                    <ExamUnitCollapse
                      key={unit.id}
                      handleStageQuestion={handleStageQuestion}
                      unit={unit}
                    />
                  ))}
                  <Box sx={{ p: 5, width: '100%' }}>
                    <AddCard
                      onClick={() =>
                        setOpenQuestionBankModal(!openQuestionBankModal)
                      }
                      title={t('questionsBank.addingTypeLable').toString()}
                    />
                  </Box>
                </Box>
              </motion.div>
            ) : activeTab === 1 ? (
              <motion.div
                animate={{
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                }}
              >
                <Box
                  sx={{ height: '100vh', width: '100%', overflowY: 'scroll' }}
                >
                  <ExamPaperSetting
                    setPaperBodyStyle={setPaperBodyStyle}
                    setPaperMainTitle={setPaperMainTitle}
                    setPaperMainTitleFontStyle={setPaperMainTitleFontStyle}
                    setShowPaperInfo={setShowPaperInfo}
                    showPaperInfo={showPaperInfo}
                    setPaperLang={setPaperLang}
                    paperLang={paperLang}
                    choicesGrid={choicesGrid}
                    setChoicesGrid={setChoicesGrid}
                  />
                </Box>
              </motion.div>
            ) : (
              <NoData />
            )}
          </Grid>
        </Grid>

        <Box mt={2}>
          <Button
            sx={{ width: '75px' }}
            variant="contained"
            type="submit"
            onClick={handleExamQuestionAction}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <HashLoader color="#808080" size={20} />
            ) : (
              t('common.submit')
            )}
          </Button>
        </Box>
      </Box>
      <FadeModal
        width={900}
        open={openQuestionBankModal!}
        setOpen={setOpenQuestionBankModal}
        modalTitle={String(t('questionsBank.addQuestion'))}
      >
        <Tabs
          sx={{ py: 2 }}
          value={questionModalActiveTab}
          onChange={(_, value) => setQuestionModalActiveTab(value)}
        >
          <Tab value={0} label={t('questionsBank.manualAdding')} />
          <Tab value={1} label={t('questionsBank.importExcel')} />
        </Tabs>

        {questionModalActiveTab === 0 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <QuestionBankForm
              onAbortClick={abortHandler.current}
              progress={progress}
              editItem={null}
              onSubmit={(data) =>
                handleQuestionAction(setProgress, abortHandler, data)
              }
            />
          </motion.div>
        ) : questionModalActiveTab === 1 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <QuestionBankUploadExcelForm onSubmit={handleUploadExcel} />
          </motion.div>
        ) : (
          <NoData />
        )}
      </FadeModal>
    </>
  );
}

export default ProtectPage({
  Page: QuestionActionPage,
  internalPathNameSearch: true,
});
