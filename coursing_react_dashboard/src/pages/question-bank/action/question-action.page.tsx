/* eslint-disable no-nested-ternary */
import { Box } from '@mui/material';
import QuestionApi from 'apis/qusetions/questions.api';
import {
  IQuestionBankPayload,
  IQuestionBankPayloadForm,
  QuestionTypeEnum,
} from 'apis/qusetions/questions.interfaces';
import QuestionQueries from 'apis/qusetions/questions.queries';
import PageTitle from 'components/common/generic-table-page/components/page-title/page-title.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import ProtectPage from 'components/common/protect-page/protectPage';
import QuestionBankForm from 'components/forms/questions-bank/question-bank.form';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { showSuccess } from 'libs/react.toastify';
import { MutableRefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getImageServerLink } from 'utils/helpers';
import prepareBankQuestion from '../helpers/prepare-bank-question-form-data';

function QuestionActioPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const Navigate = useNavigate();

  const questionId = searchParams.get('question')
    ? Number(searchParams.get('question'))
    : 0;

  const { data: EditData, isLoading } =
    QuestionQueries.useQuestionByIdQuery(questionId);

  const isLoadingDetails = isLoading && !!questionId;
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
      collegeDetailsSubjectUnitIds:
        data.collegeSubjectUnitIds?.map((collegeUnit) => collegeUnit.id) ||
        null,
      collegeId: data.collegeId?.id || null,
      questionLevel: data.questionLevel?.id,
      questionType: data.questionType?.id,
      trueFalseAnswer:
        data.questionType?.id === QuestionTypeEnum.TrueAndFalse
          ? !!data.trueFalseAnswer
          : null,
      specialityId: data.specialityId?.id || null,
      gradeSubjectId: data.gradeSubjectId?.id || null,
      gradeId: data.gradeId?.id || null,
      gradeSubjectUnitIds:
        data.gradeSubjectUnitIds?.map((schoolUnit) => schoolUnit.id) || null,
      choices:
        data.questionType?.id === QuestionTypeEnum.MultiChoice
          ? data.choices?.map((choice) => ({
              title: choice.title,
              theTrueAnswer: choice.theTrueAnswer,
            }))
          : [],
    };

    try {
      if (questionId) {
        const payload = { ...payloadData, id: questionId };
        const formData = prepareBankQuestion.prepareBankQuestionFormDataImage({
          id: questionId,
          files,
        });
        // console.log(
        //   '🚀🚀🚀🚀🚀🚀🚀 ~ QuestionActioPage ~ files:',
        //   files.length > 0 &&
        //     files.find((f) => f.url)?.url !==
        //       getImageServerLink(EditData?.imageUrl || ''),
        //   files.find((f) => f.url)?.url,
        //   getImageServerLink(EditData?.imageUrl || ''),
        // );
        await QuestionApi.updateQuestion(payload);
        if (
          files.find((f) => f.url)?.url !==
          getImageServerLink(EditData?.imageUrl || '')
        ) {
          await QuestionApi.UpdateQuestionImage(
            formData,
            onProgress,
            (handler) => {
              abortHandlerRef.current = handler;
            },
          );
        }

        showSuccess(t('common.dataUpdatedSuccessfully'));
        Navigate(-1);
      } else {
        const formData = prepareBankQuestion.prepareBankQuestionFormData({
          data: payloadData,
          files,
        });
        await QuestionApi.addQuestion(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        showSuccess(t('common.dataAddedSuccessfully'));
        Navigate(-1);
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return isLoadingDetails ? (
    <LoadingPlaceholder />
  ) : (
    <>
      <PageTitle title={t('questionsBank.questionDetails')} />
      <Box mt={4}>
        <QuestionBankForm
          onAbortClick={abortHandler.current}
          progress={progress}
          editItem={EditData ?? null}
          onSubmit={(data) =>
            handleQuestionAction(setProgress, abortHandler, data)
          }
        />
      </Box>
    </>
  );
}

export default ProtectPage({
  Page: QuestionActioPage,
  internalPathNameSearch: true,
});
