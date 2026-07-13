import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import studentApi from './student.api';
import { IGetStudentPayload } from './student.interfaces';

const useStudentsQuery = (params?: IPaginationParams & IGetStudentPayload) => {
  const queryResult = useQuery(['get-students', params], () =>
    studentApi.getAllStudents(params),
  );
  return queryResult;
};

const useStudentDetailsQuery = (id: number) => {
  const queryResult = useQuery(['get-student-details', id], () =>
    studentApi.getStudentDetails(id),
  );
  return queryResult;
};

const useStudentBalanceQuery = (studentId: number) => {
  const queryResult = useQuery(['get-student-balance', studentId], () =>
    studentApi.getStudentBalance(studentId),
  );

  return queryResult;
};

const useNewRegistrationStudentsQuery = (payload: IPaginationParams) => {
  const queryResult = useQuery(['get-new-registration-students', payload], () =>
    studentApi.getNewRegistrationStudents(payload),
  );
  return queryResult;
};

const studentQueries = {
  useStudentsQuery,
  useStudentDetailsQuery,
  useStudentBalanceQuery,
  useNewRegistrationStudentsQuery,
};

export default studentQueries;
