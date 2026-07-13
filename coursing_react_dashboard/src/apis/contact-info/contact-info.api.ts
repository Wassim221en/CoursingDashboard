import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import CoursingApiInstance from 'apis/coursing-api.instance';
import { IContactInfo, IContactInfoPayload } from './contact-info.interfaces';
import { ContactInfoApisRoutes } from './contact-info-api-routes';

const getAllContactInfo = async (payload: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IResponse<IContactInfo[]>>(
    ContactInfoApisRoutes.GetAll,
    {
      params: payload,
    },
  );
  return data;
};

const updateAllContactInfo = async (payload: IContactInfoPayload) => {
  const { data } = await CoursingApiInstance.put(
    ContactInfoApisRoutes.Update,
    payload,
  );
  return data;
};

const contactInfoApis = {
  getAllContactInfo,
  updateAllContactInfo,
};

export default contactInfoApis;
