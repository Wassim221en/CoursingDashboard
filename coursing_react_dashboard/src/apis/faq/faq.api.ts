import CoursingApiInstance from 'apis/coursing-api.instance';
import { IResponse } from 'apis/global-interfaces/global-interfaces';
import { IFaq, IFaqPayload } from './faq.interfaces';
import FaqApiRoutes from './faq.api-routes';

const getAllFaqs = async () => {
  const { data } = await CoursingApiInstance.get<IResponse<IFaq[]>>(
    FaqApiRoutes.GetAllFaqs,
  );
  return data;
};

const addFaq = async (payload: IFaqPayload) => {
  const { data } = await CoursingApiInstance.post(FaqApiRoutes.AddFaq, payload);
  return data;
};

const updateFaq = async (payload: IFaqPayload) => {
  const { data } = await CoursingApiInstance.put(
    FaqApiRoutes.UpdateFaq,
    payload,
  );
  return data;
};

const removeFaq = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(FaqApiRoutes.RemoveFaq, {
    params: {
      id,
    },
  });
  return data;
};

const faqApi = {
  getAllFaqs,
  addFaq,
  updateFaq,
  removeFaq,
};

export default faqApi;
