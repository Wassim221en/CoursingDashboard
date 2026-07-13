import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IGetLessonsPayload,
  ILessonDetails,
  ILesson,
} from './lesson.interfaces';
import LessonApiRoutes from './lesson.api-routes';

const getAllLessons = async (
  payload: IGetLessonsPayload & IPaginationParams,
) => {
  const { data } = await CoursingApiInstance.get<IResponse<ILesson[]>>(
    LessonApiRoutes.GetAllLessons,
    {
      params: payload,
    },
  );
  return data;
};

const getLessonById = async (lessonId: number) => {
  if (!lessonId) return null;
  const { data } = await CoursingApiInstance.get<ILessonDetails>(
    LessonApiRoutes.GetLessonDetails,
    {
      params: { lessonId },
    },
  );
  return data;
};

const addLesson = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    LessonApiRoutes.AddLesson,
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

const updateLesson = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    LessonApiRoutes.UpdateLesson,
    payload,
    {
      onUploadProgress: (e) => setProgress((e.progress || 0) * 100),
      signal: controller.signal,
    },
  );
  return data;
};
const updateLessonOrder = async (lessonId: number, order: number) => {
  const { data } = await CoursingApiInstance.put(
    LessonApiRoutes.UpdateLessonOrder,
    null,
    { params: { lessonId, order } },
  );
  return data;
};

const removeLesson = async (lessonId: number) => {
  const { data } = await CoursingApiInstance.delete(
    LessonApiRoutes.RemoveLesson,
    {
      params: {
        lessonId,
      },
    },
  );
  return data;
};

const lessonApi = {
  getAllLessons,
  getLessonById,
  addLesson,
  updateLesson,
  updateLessonOrder,
  removeLesson,
};

export default lessonApi;
