/* eslint-disable no-nested-ternary */
import { Box } from '@mui/material';
import QuestionApi from 'apis/qusetions/questions.api';
import {
  IQuestionBankPayloadForm,
  IUploadExcelPayload,
} from 'apis/qusetions/questions.interfaces';
import PageTitle from 'components/common/generic-table-page/components/page-title/page-title.component';
import ProtectPage from 'components/common/protect-page/protectPage';
import prepareUploadExcelFormData from 'components/forms/questions-bank/helper/prepare-upload-excel-form-data';
import QuestionBankUploadExcelForm from 'components/forms/questions-bank/qusetion-bank-upload-excel.form';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { showSuccess } from 'libs/react.toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function UploadExcelPage() {
  const { t } = useTranslation();
  const Navigate = useNavigate();

  const handleUploadExcel = async ({
    data,
    files,
  }: TSubmitHandlerData<IQuestionBankPayloadForm>) => {
    const Parameters: IUploadExcelPayload = {
      ...data,
      collegeDetailsSubjectId: data.collegeDetailsSubjectId?.id || null,
      collegeId: null,
      gradeSubjectId: data.gradeSubjectId?.id || null,
      specializedId: data.specialityId?.id || null,
    };

    try {
      const FormData = prepareUploadExcelFormData({
        files,
      });

      await QuestionApi.uploadExcelFile(Parameters, FormData);

      showSuccess(t('addSuccess', { var: t('questionsBank.excelFile') }));
      Navigate(-1);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <PageTitle title={t('questionsBank.uploadExcel')} />
      <Box mt={4}>
        <QuestionBankUploadExcelForm onSubmit={handleUploadExcel} />
      </Box>
    </>
  );
}
export default ProtectPage({
  Page: UploadExcelPage,
  internalPathNameSearch: true,
});
