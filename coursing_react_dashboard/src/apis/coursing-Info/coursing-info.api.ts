import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import CoursingInfoApiRoutes from './coursing-info.api-route';
import {
  ICoursingInfo,
  ICoursingInfoPayload,
} from './coursing-info.interfaces';

const getAllCoursingInfo = async (payload: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICoursingInfo[]>>(
    CoursingInfoApiRoutes.GetAll,
    {
      params: payload,
    },
  );

  return data;
};

const updateCoursingInfo = async (payload: ICoursingInfoPayload) => {
  const { data } = await CoursingApiInstance.post(
    CoursingInfoApiRoutes.Update,
    payload,
  );
  return data;
};

const coursingInfoApis = {
  getAllCoursingInfo,
  updateCoursingInfo,
};

export default coursingInfoApis;
