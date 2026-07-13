import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IPaginationParams,
  IResponse,
} from 'apis/global-interfaces/global-interfaces';
import { IAppRating } from './app-rating.interfaces';
import { AppRatingApiRoutes } from './app-rating-api-routes';

const getCoursingRating = async (payload: IPaginationParams) => {
  const { data } = await CoursingApiInstance.get<IAppRating>(
    AppRatingApiRoutes.GetAll,
    {
      params: payload,
    },
  );

  return data;
};

const appRatingApis = {
  getCoursingRating,
};

export default appRatingApis;
