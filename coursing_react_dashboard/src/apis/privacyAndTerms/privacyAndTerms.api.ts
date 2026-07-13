import CoursingApiInstance from 'apis/coursing-api.instance';
import { IPrivacyAndTerms } from './privacyAndTerms.interfaces';
import { PrivacyAndTermsApisRoutes } from './privacyAndTerms.api-routes';

const getAllPrivacyAndTerms = async () => {
  const { data } = await CoursingApiInstance.get<IPrivacyAndTerms[]>(
    PrivacyAndTermsApisRoutes.GetAll,
  );

  return data;
};

const addPrivacyAndTerms = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    PrivacyAndTermsApisRoutes.Add,
    payload,
  );

  return data;
};

const updatePrivacyAndTerms = async (payload: FormData) => {
  const { data } = await CoursingApiInstance.post(
    PrivacyAndTermsApisRoutes.Update,
    payload,
  );

  return data;
};

const removePrivacyAndTerms = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    PrivacyAndTermsApisRoutes.Remove,
    {
      params: { id },
    },
  );
  return data;
};

const PrivacyAndTermsApis = {
  getAllPrivacyAndTerms,
  addPrivacyAndTerms,
  removePrivacyAndTerms,
  updatePrivacyAndTerms,
};

export default PrivacyAndTermsApis;
