import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { IGetAds, IAds } from './ads.interfaces';
import { AdsApiRoutes } from './ads-api-routes';

const getAllAds = async (payload: IPaginationParams & IGetAds) => {
  const { data } = await CoursingApiInstance.get<IResponse<IAds[]>>(
    AdsApiRoutes.GetAll,
    {
      params: payload,
    },
  );

  return data;
};

const getAdsById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IAds>(AdsApiRoutes.GetById, {
    params: { id },
  });

  return data;
};

const addAds = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(AdsApiRoutes.Add, payload, {
    onUploadProgress: (e) => {
      setProgress((e.progress || 0) * 100);
    },
    signal: controller.signal,
  });

  return data;
};

const updateAds = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(AdsApiRoutes.Update, payload);

  return data;
};

const removeAds = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(AdsApiRoutes.Remove, {
    params: { id },
  });

  return data;
};

const adsApis = {
  getAllAds,
  getAdsById,
  addAds,
  updateAds,
  removeAds,
};

export default adsApis;
