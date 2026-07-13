import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { IStudent } from 'apis/student/student.interfaces';
import CourseApiRoutes from './course.api-routes';
import {
  IActionQa,
  ICourse,
  ICourseDetails,
  ICourseQuestion,
  ICourseQuestionPayload,
  ICourseRating,
  ICourseRatingPayload,
  ICourseStudents,
  IGetCourseQuestionPayload,
  IGetCourseStudentPayload,
  IGetCoursesPayload,
  IGetStudentsOrderInCoursePayload,
  IInstructorCourseRating,
  IMostPopularCourse,
} from './course.interfaces';

// #region GET
const getAllCorses = async (
  payload: IGetCoursesPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICourse[]>>(
    CourseApiRoutes.GET_ALL,
    {
      params: payload,
    },
  );
  return data;
};
const getCourseDetails = async (id: number | null) => {
  const { data } = await CoursingApiInstance.get<ICourseDetails>(
    CourseApiRoutes.GET_BY_ID,
    { params: { id } },
  );
  return data;
};
const getCoursesByStudentInterest = async () => {
  const { data } = await CoursingApiInstance.get<ICourse[]>(
    CourseApiRoutes.GET_BY_STUDENT_INTEREST,
  );
  return data;
};
const getCoursesByInstructor = async (InstructorId: number) => {
  const { data } = await CoursingApiInstance.get<ICourse[]>(
    CourseApiRoutes.GET_BY_INSTRUCTOR,
    {
      params: { InstructorId },
    },
  );
  return data;
};

const addCourse = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    CourseApiRoutes.ADD_COURSE,
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
const updateCourse = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    CourseApiRoutes.UPDATE_COURSE,
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
const removeCourse = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    CourseApiRoutes.REMOVE_COURSE,
    { params: { id } },
  );
  return data;
};

const enrollCourse = async (courseId: number) => {
  const { data } = await CoursingApiInstance.post(
    CourseApiRoutes.ENROLL,
    {},
    { params: { courseId } },
  );
  return data;
};
const unenrollCourse = async (courseId: number) => {
  const { data } = await CoursingApiInstance.post(
    CourseApiRoutes.UNENROLL,
    {},
    { params: { courseId } },
  );
  return data;
};

const rateCourse = async (courseId: number, rating: number) => {
  const { data } = await CoursingApiInstance.patch(
    CourseApiRoutes.SET_RATING,
    {},
    { params: { courseId, rating } },
  );
  return data;
};
const unRateCourse = async (courseId: number) => {
  const { data } = await CoursingApiInstance.patch(
    CourseApiRoutes.CLEAR_RATING,
    {},
    { params: { courseId } },
  );
  return data;
};

const getCourseStudnets = async (
  payload: IPaginationParams & IGetCourseStudentPayload,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICourseStudents[]>>(
    CourseApiRoutes.GET_COURSE_STUDENT,
    {
      params: payload,
    },
  );
  return data;
};

const getMostPopularCourse = async (paylaod: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<
    IResponse<IMostPopularCourse[]>
  >(CourseApiRoutes.GET_MOST_POPULAR, {
    params: paylaod,
  });

  return data;
};

const getCourseQustionsAndAnswers = async (
  payload: IPaginationParams & IGetCourseQuestionPayload,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICourseQuestion[]>>(
    CourseApiRoutes.GetAllQA,
    {
      params: { ...payload, fromDashboard: true },
    },
  );
  return data;
};

const addCourseQuestionAnswer = async (payload: ICourseQuestionPayload) => {
  const { data } = await CoursingApiInstance.post(
    CourseApiRoutes.AddAnswer,
    payload,
  );
  return data;
};

const updateCourseQuestionAnswer = async (payload: ICourseQuestionPayload) => {
  const { data } = await CoursingApiInstance.put(
    CourseApiRoutes.UpdateAnswer,
    payload,
  );
  return data;
};

const updateCourseQuestionState = async (
  questionId: number,
  isHidden: boolean = true,
) => {
  const { data } = await CoursingApiInstance.put(
    CourseApiRoutes.UpdateQuestionState,
    null,
    { params: { id: questionId, isHidden } },
  );
  return data;
};
const updateCourseQuestionOrder = async (questionId: number, order: number) => {
  const { data } = await CoursingApiInstance.put(
    CourseApiRoutes.UpdateQuestionOrder,
    null,
    { params: { id: questionId, order } },
  );
  return data;
};

const removeCourseQuestion = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    CourseApiRoutes.Remove_Question,
    {
      params: { id },
    },
  );
  return data;
};

const removeCourseQuestionAnswer = async (answerId: number) => {
  const { data } = await CoursingApiInstance.delete(
    CourseApiRoutes.REMOVE_ANSWER,
    {
      params: { answerId },
    },
  );
  return data;
};

const getStudentsOrderInCourse = async (
  payload: IGetStudentsOrderInCoursePayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<IStudent[]>>(
    CourseApiRoutes.GET_STDUENTS_ORDER_IN_COURSE,
    {
      params: payload,
    },
  );
  return data;
};

const getCourseRating = async (
  payload: ICourseRatingPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<ICourseRating>(
    CourseApiRoutes.GET_COURSE_RATING,
    {
      params: payload,
    },
  );
  return data;
};

const getInstructorCourseRating = async (
  payload: ICourseRatingPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IInstructorCourseRating>(
    CourseApiRoutes.GET_INSTRUCTOR_COURSE_RATINGS,
    {
      params: payload,
    },
  );
  return data;
};

const addQA = async (payload: IActionQa) => {
  await CoursingApiInstance.post(CourseApiRoutes.ADDQA, payload);
};
const updateAQ = async (payload: IActionQa) => {
  await CoursingApiInstance.put(CourseApiRoutes.UpdateQA, payload);
};
const getQA = async (id?: number) => {
  const { data } = await CoursingApiInstance.get<ICourseQuestion>(
    CourseApiRoutes.GetQA,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const updateCoursePublishState = async (
  courseId: number,
  isPublish: boolean,
) => {
  const { data } = await CoursingApiInstance.put(
    CourseApiRoutes.UPDATE_COURSE_PUBLISH_STATE,
    null,
    { params: { courseId, isPublish } },
  );
  return data;
};
const setAllCourseQuestionsAsRead = async (courseId: number) => {
  const { data } = await CoursingApiInstance.get(
    CourseApiRoutes.MARK_ALL_COURSE_QUESTIONS_AS_READ,
    { params: { courseId } },
  );
  return data;
};

const courseApi = {
  addQA,
  updateAQ,
  getQA,
  getAllCorses,
  getCourseDetails,
  getCoursesByInstructor,
  getCoursesByStudentInterest,
  addCourse,
  updateCourse,
  removeCourse,
  enrollCourse,
  unenrollCourse,
  rateCourse,
  unRateCourse,
  getCourseStudnets,
  getMostPopularCourse,
  getCourseQustionsAndAnswers,
  addCourseQuestionAnswer,
  updateCourseQuestionAnswer,
  removeCourseQuestion,
  removeCourseQuestionAnswer,
  getStudentsOrderInCourse,
  getCourseRating,
  getInstructorCourseRating,
  updateCourseQuestionState,
  updateCourseQuestionOrder,
  updateCoursePublishState,
  setAllCourseQuestionsAsRead,
};

export default courseApi;
