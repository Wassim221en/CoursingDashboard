import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { IGetNews, INews } from './news.interfaces';
import { NewsApiRoutes } from './news-api-routes';

const getAllNews = async (payload: IPaginationParams & IGetNews) => {
  const { data } = await CoursingApiInstance.get<IResponse<INews[]>>(
    NewsApiRoutes.GetAll,
    {
      params: payload,
    },
  );

  return data;
};

const getNewsById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<INews>(NewsApiRoutes.GetById, {
    params: { id },
  });

  return data;
};

const addNews = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(NewsApiRoutes.Add, payload, {
    onUploadProgress: (e) => {
      setProgress((e.progress || 0) * 100);
    },
    signal: controller.signal,
  });

  return data;
};

const updateNews = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    NewsApiRoutes.Update,
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

const removeNews = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(NewsApiRoutes.Remove, {
    params: { id },
  });

  return data;
};

const newsApis = {
  getAllNews,
  getNewsById,
  addNews,
  updateNews,
  removeNews,
};

export default newsApis;
