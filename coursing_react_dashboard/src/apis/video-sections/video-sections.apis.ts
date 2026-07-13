import CoursingApiInstance from 'apis/coursing-api.instance';
import { IResponse } from 'apis/global-interfaces/global-interfaces';
import {
  IGetVideoSectionsPayload,
  IVideoSection,
} from './video-sections.interface';
import VideoSectionApiRoutes from './video-sections.api-routes';

const getAllVideoSections = async (params?: IGetVideoSectionsPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<IVideoSection[]>>(
    VideoSectionApiRoutes.GetAllVideoSections,
    {
      params,
    },
  );
  return data;
};

const getVideoSectionById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<IVideoSection>(
    VideoSectionApiRoutes.GetVideoSectionById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addVideoSection = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    VideoSectionApiRoutes.AddVideoSections,
    payload,
  );
  return data;
};

const updateVideoSection = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.put(
    VideoSectionApiRoutes.UpdateVideoSection,
    payload,
  );
  return data;
};

const removeVideoSection = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    VideoSectionApiRoutes.RemoveVideoSection,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const videoSectionApi = {
  getAllVideoSections,
  getVideoSectionById,
  addVideoSection,
  updateVideoSection,
  removeVideoSection,
};

export default videoSectionApi;
