import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import instructorApi from './instructor.api';

const useInstructorQuery = (params?: IPaginationParams) => {
  const queryResult = useQuery(['get-instructors', params], () =>
    instructorApi.getAllInstructor(params),
  );
  return queryResult;
};

const useInstructorDetailsQuery = (id: number) => {
  const queryResult = useQuery(['get-instructor-by-id', id], () =>
    instructorApi.getInstructorById(id),
  );
  return queryResult;
};

const useInstructorCertificatesQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-instructor-certificates', id],
    () => instructorApi.getInstructorById(id),
    {
      select: (data) => data.certificates,
    },
  );
  return queryResult;
};

const instructorQueries = {
  useInstructorDetailsQuery,
  useInstructorQuery,
  useInstructorCertificatesQuery,
};

export default instructorQueries;
