import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import {
  IAttachments,
  IAvatarFiles,
} from 'apis/attachments/attachments.interfaces';
import { AttachmentsApiRoutes } from './attachments-api-routes';

const GetAttachments = async (payload: IAttachments & IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IAttachments[]>>(
    AttachmentsApiRoutes.GetAttachments,
    {
      params: payload,
    },
  );
  return data;
};

const addAttachments = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.post(
    AttachmentsApiRoutes.AddAttachments,
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

const updateAttachments = async (
  payload: FormData,
  setProgress: (progress: number) => void,
  setAbortHandler?: (handler: (reason?: any) => void) => void,
) => {
  const controller = new AbortController();
  setAbortHandler?.((reason) => controller.abort(reason));
  const { data } = await CoursingApiInstance.put(
    AttachmentsApiRoutes.UpdateAttachments,
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
const updateAttachmentsOrder = async (attachmentId: number, order: number) => {
  const { data } = await CoursingApiInstance.put(
    AttachmentsApiRoutes.UpdateAttachmentsOrder,
    null,
    { params: { attachmentId, order } },
  );
  return data;
};

const removeAttachments = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    AttachmentsApiRoutes.RemoveAttachments,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addAvatarFiles = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    AttachmentsApiRoutes.AddAvatarFiles,
    payload,
  );
  return data;
};

const getAllAvatarFiles = async (payload: IAvatarFiles & IPaginationParams) => {
  const { data } = await CoursingApiInstance.get(
    AttachmentsApiRoutes.GetAllAvatarFiles,
    {
      params: payload,
    },
  );
  return data;
};

const removeAvatarFiles = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    AttachmentsApiRoutes.RemoveAvatarFiles,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const attachmentsApi = {
  addAttachments,
  GetAttachments,
  updateAttachments,
  updateAttachmentsOrder,
  removeAttachments,
  addAvatarFiles,
  getAllAvatarFiles,
  removeAvatarFiles,
};

export default attachmentsApi;
