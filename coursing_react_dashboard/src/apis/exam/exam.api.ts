import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IExam,
  IExamPayload,
  IExamQuestionPayload,
  IExamUserPayload,
  IGetExamQuestionPayload,
  IGetSchoolExamPayload,
  IGetSpecializedExamPayload,
  IGetUniversityExamPayload,
  IQuestion,
  IQuestionPayload,
} from './exam.interfaces';
import { IStudent } from 'apis/student/student.interfaces';
import ExamApiRoutes from './exam.api-routes';

const getAllExams = async (
  payload?: IGetUniversityExamPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<IExam[]>>(
    ExamApiRoutes.GetAllExams,
    { params: payload },
  );
  return data;
};

const getAllUniversityExams = async (payload?: IGetUniversityExamPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<IExam[]>>(
    ExamApiRoutes.GetAllUniversityExams,
    { params: payload },
  );
  return data;
};

const getAllSchoolExams = async (
  payload?: IGetSchoolExamPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<IExam[]>>(
    ExamApiRoutes.GetAllSchoolExams,
    { params: payload },
  );
  return data;
};

const getAllSpecializedExams = async (
  payload?: IGetSpecializedExamPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<IExam[]>>(
    ExamApiRoutes.GetAllSpecializedExams,
    { params: payload },
  );
  return data;
};

const getExamById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IExam>(
    ExamApiRoutes.GetExamById,
    { params: { id } },
  );
  return data;
};

const addExamQuestion = async (payload: IExamQuestionPayload) => {
  const { data } = await CoursingApiInstance.post(
    ExamApiRoutes.AddExamQuestion,
    payload,
  );
  return data;
};

const updateExamQuestion = async (payload: IExamQuestionPayload) => {
  const { data } = await CoursingApiInstance.put(
    ExamApiRoutes.UpdateExamQuestion,
    payload,
  );
  return data;
};

const removeExam = async (examId: number) => {
  const { data } = await CoursingApiInstance.delete(ExamApiRoutes.RemoveExam, {
    params: { examId },
  });
  return data;
};

const getAllPastExams = async () => {
  const { data } = await CoursingApiInstance.get<IExam[]>(
    ExamApiRoutes.GetAllPastExams,
  );
  return data;
};

const getPastExamById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IExam>(
    ExamApiRoutes.GetPastExamById,
    { params: { id } },
  );
  return data;
};
const GetUserExams = async (params: IExamUserPayload & IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IExam[]>>(
    ExamApiRoutes.GetUserExams,
    { params },
  );
  return data;
};
const getStudentsOrderInExam = async (examId: number) => {
  const { data } = await CoursingApiInstance.get<IResponse<IStudent[]>>(
    ExamApiRoutes.GetStudentsOrderInExam,
    { params: { examId } },
  );
  return data;
};
const addPastExam = async (payload: IExamPayload) => {
  const { data } = await CoursingApiInstance.post(
    ExamApiRoutes.AddPastExam,
    payload,
  );
  return data;
};

const updatePastExam = async (payload: IExamPayload) => {
  const { data } = await CoursingApiInstance.put(
    ExamApiRoutes.UpdatePastExam,
    payload,
  );
  return data;
};

const removePastExam = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    ExamApiRoutes.RemovePastExam,
    { params: { id } },
  );
  return data;
};

const getAllQuestions = async (payload?: IGetExamQuestionPayload) => {
  const { data } = await CoursingApiInstance.get<IQuestion[]>(
    ExamApiRoutes.GetAllQuestions,
    { params: payload },
  );
  return data;
};

const getQuestionById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IQuestion>(
    ExamApiRoutes.GetQuestionById,
    { params: { id } },
  );
  return data;
};

const addQuestion = async (payload: IQuestionPayload) => {
  const { data } = await CoursingApiInstance.post(
    ExamApiRoutes.AddQuestion,
    payload,
  );
  return data;
};

const updateQuestion = async (payload: IQuestionPayload) => {
  const { data } = await CoursingApiInstance.put(
    ExamApiRoutes.UpdateQuestion,
    payload,
  );
  return data;
};

const addExam = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    ExamApiRoutes.AddExam,
    payload,
  );
  return data;
};

const updateExam = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    ExamApiRoutes.UpdateExam,
    payload,
  );
  return data;
};

const updateExamOrder = async (examId: number, order: number) => {
  const { data } = await CoursingApiInstance.put(
    ExamApiRoutes.UpdateExamOrder,
    null,
    { params: { examId, order } },
  );
  return data;
};

const removeQuestion = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    ExamApiRoutes.RemoveQuestion,
    { params: { id } },
  );
  return data;
};

const removeExamQuestion = async (examQuestionId: number) => {
  const { data } = await CoursingApiInstance.delete(
    ExamApiRoutes.RemoveExamQuestion,
    { data: [examQuestionId] },
  );
  return data;
};

const examApi = {
  getAllExams,
  getExamById,
  addExam,
  updateExam,
  updateExamOrder,
  removeExam,
  getAllPastExams,
  getPastExamById,
  addPastExam,
  updatePastExam,
  removePastExam,
  getAllQuestions,
  getQuestionById,
  addQuestion,
  updateQuestion,
  removeQuestion,
  removeExamQuestion,
  getAllUniversityExams,
  getAllSchoolExams,
  getAllSpecializedExams,
  addExamQuestion,
  updateExamQuestion,
  GetUserExams,
  getStudentsOrderInExam,
};

export default examApi;
