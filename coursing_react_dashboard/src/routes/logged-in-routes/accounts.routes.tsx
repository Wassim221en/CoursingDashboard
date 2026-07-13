import { lazy } from 'react';
import routesNames from 'routes/constants';
import TRoute from 'routes/types';

const InstructorPage = lazy(() => import('pages/instructor/instructor.page'));

const InstructorDetailsPage = lazy(
  () => import('pages/instructor-details/instructor-details.page'),
);

const StudentPage = lazy(() => import('pages/student/student.page'));

const UsersPage = lazy(() => import('pages/users/users.page'));

const UsersPremissionPage = lazy(
  () => import('pages/permissions/permissions.page'),
);

const ActionPremissions = lazy(
  () => import('pages/permissions/action/permissions-action.page'),
);

const InstructorsReports = lazy(() => import('pages/reports/reports.page'));

const accountsSittingsRoutes: TRoute[] = [
  {
    path: routesNames.instructors,
    element: <InstructorPage />,
  },
  {
    path: routesNames.instructorDetails,
    element: <InstructorDetailsPage />,
  },
  {
    path: routesNames.instructorsReports,
    element: <InstructorsReports />,
  },
  {
    path: routesNames.students,
    element: <StudentPage />,
  },
  {
    path: routesNames.users,
    element: <UsersPage />,
  },
  {
    path: routesNames.userRolesAndPermissions,
    element: <UsersPremissionPage />,
  },
  {
    path: `${routesNames.userRolesAndPermissions}/action`,
    element: <ActionPremissions />,
  },
];

export default accountsSittingsRoutes;
