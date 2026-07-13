import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { QuestionsRoutes } from './question.api-routes';
import {
  IQuestionBank,
  IQuestionBankPayload,
  IExamQuestionPayload,
  IUploadExcelPayload,
} from './questions.interfaces';

const getAllQuestions = async (
  payload: IExamQuestionPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<IQuestionBank[]>>(
    QuestionsRoutes.GetAllQuestions,
    {
      params: payload,
    },
  );
  return data;
};

const getQuestionById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IQuestionBank>(
    QuestionsRoutes.GetQuestion,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addQuestion = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    QuestionsRoutes.AddQuestion,
    payload,
    {
      onUploadProgress: (e) => {
        setProgress((e.progress || 0) * 100);
      },
      signal: controller.signal,
    },
  );
  return data;
};

const updateQuestion = async (
  payload: IQuestionBankPayload,
  // setProgress: (progress: number) => void,
  // setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  // const controller = new AbortController();
  // setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    QuestionsRoutes.UpdateQuestion,
    payload,
    // {
    //   onUploadProgress: (e) => {
    //     setProgress((e.progress || 0) * 100);
    //   },
    //   signal: controller.signal,
    // },
  );
  return data;
};
const UpdateQuestionImage = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    QuestionsRoutes.UpdateQuestionImage,
    payload,
    {
      onUploadProgress: (e) => {
        setProgress((e.progress || 0) * 100);
      },
      signal: controller.signal,
    },
  );
  return data;
};

const removeQuestion = async (questionId: number) => {
  const { data } = await CoursingApiInstance.delete(
    QuestionsRoutes.RemoveQuestion,
    {
      params: {
        questionId,
      },
    },
  );
  return data;
};

const uploadExcelFile = async (
  parameters: IUploadExcelPayload,
  FormData: FormData,
) => {
  const { data } = await CoursingApiInstance.post<IQuestionBank[]>(
    QuestionsRoutes.UploadExcelFile,
    FormData,
    {
      params: {
        collegeDetailsSubjectId: parameters.collegeDetailsSubjectId,
        gradeSubjectId: parameters.gradeSubjectId,
        specializedId: parameters.specializedId,
        examId: parameters.examId,
      },
    },
  );

  return data;
};

const QuestionApi = {
  getAllQuestions,
  getQuestionById,
  addQuestion,
  updateQuestion,
  UpdateQuestionImage,
  removeQuestion,
  uploadExcelFile,
};

export default QuestionApi;
