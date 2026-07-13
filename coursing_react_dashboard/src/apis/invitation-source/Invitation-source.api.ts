import CoursingApiInstance from 'apis/coursing-api.instance';
import { IKnowingSourceStatistics } from './Invitation-source.interfaces';
import { InvitationSourceApiRoutes } from './Invitation-source.api-route';

const getKnowingSourceStatistics = async () => {
  const { data } = await CoursingApiInstance.post<IKnowingSourceStatistics[]>(
    InvitationSourceApiRoutes.GetAll,
  );
  return data;
};

export default getKnowingSourceStatistics;
