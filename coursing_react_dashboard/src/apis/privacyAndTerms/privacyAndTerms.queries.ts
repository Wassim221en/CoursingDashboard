import { useQuery } from '@tanstack/react-query';
import PrivacyAndTermsApis from './privacyAndTerms.api';

const usePrivacyAndTermsQuery = () => {
  const queryResult = useQuery(['get-all-privacy-and-terms'], () =>
    PrivacyAndTermsApis.getAllPrivacyAndTerms(),
  );
  return queryResult;
};

const PrivacyAndTermsQueries = {
  usePrivacyAndTermsQuery,
};

export default PrivacyAndTermsQueries;
