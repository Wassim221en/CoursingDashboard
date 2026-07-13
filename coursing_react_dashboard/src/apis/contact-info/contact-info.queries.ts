import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import contactInfoApis from './contact-info.api';

const useContactInfoQuery = (payload: IPaginationParams) => {
  const queryResult = useQuery(['get-all-contact-info', payload], () =>
    contactInfoApis.getAllContactInfo(payload),
  );

  return queryResult;
};

const contactInfoQueries = {
  useContactInfoQuery,
};

export default contactInfoQueries;
