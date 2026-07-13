import { IPrivacyAndTermsPayload } from 'apis/privacyAndTerms/privacyAndTerms.interfaces';

const preparePrivacyAndTermsFormData = ({
  data,
}: {
  data: IPrivacyAndTermsPayload;
}) => {
  const formData = new FormData();

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default preparePrivacyAndTermsFormData;
