import CoursingApiInstance from 'apis/coursing-api.instance';
import CourseQuestionApiRoutes from './course-question.api-route';
import {
  ICourseQuestion,
  ICourseQuestionPayload,
  IEditCourseQuestionPayload,
  IGetCourseQuestion,
} from './course-question.interfaces';

const getAllCourseQuestions = async (payload?: IGetCourseQuestion) => {
  const { data } = await CoursingApiInstance.get<ICourseQuestion[]>(
    CourseQuestionApiRoutes.GetAllCourseQuestions,
    {
      params: payload,
    },
  );
  return data;
};

const getCourseQuestionById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ICourseQuestion>(
    CourseQuestionApiRoutes.GetCourseQuestionById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addCourseQuestion = async (payload: ICourseQuestionPayload) => {
  const { data } = await CoursingApiInstance.post(
    CourseQuestionApiRoutes.AddCourseQuestion,
    payload,
  );
  return data;
};

const updateCourseQuestion = async (payload: IEditCourseQuestionPayload) => {
  const { data } = await CoursingApiInstance.put(
    CourseQuestionApiRoutes.UpdateCourseQuestion,
    payload,
  );
  return data;
};

const removeCourseQuestion = async (CourseQuestionId: number) => {
  const { data } = await CoursingApiInstance.delete(
    CourseQuestionApiRoutes.RemoveCourseQuestion,
    {
      params: {
        CourseQuestionId,
      },
    },
  );
  return data;
};

const courseQuestionApi = {
  getAllCourseQuestions,
  getCourseQuestionById,
  addCourseQuestion,
  updateCourseQuestion,
  removeCourseQuestion,
};

export default courseQuestionApi;
