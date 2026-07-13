/* eslint-disable react/no-array-index-key */
import { lazy } from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import authSelectors from 'redux/slices/auth/auth.selectors';
import LoggedInRouteComponent from './components/logged-in-route-wrapper/logged-in-route-wrapper.component';
import routesNames from './constants';
import loggedInRoutes from './logged-in-routes';

const LoginPage = lazy(() => import('pages/login/login.page'));
const HomePage = lazy(() => import('pages/home/home.page'));
const NotFoundPage = lazy(() => import('pages/error-pages/not-found.page'));
const WelcomePage = lazy(() => import('pages/welcome/welcome.page'));

function Routes() {
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);

  return (
    <RouterRoutes>
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to={routesNames.welcome} /> : <LoginPage />
        }
      />
      <Route
        path={routesNames.welcome}
        element={isLoggedIn ? <WelcomePage /> : <Navigate to="/" />}
      />
      <Route
        path={routesNames.home}
        element={isLoggedIn ? <HomePage /> : <Navigate to="/" />}
      />
      {loggedInRoutes.map((route, index) => (
        <Route
          key={route.path + index * Math.random()}
          path={route.path}
          element={
            <LoggedInRouteComponent>{route.element}</LoggedInRouteComponent>
          }
        />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </RouterRoutes>
  );
}

export default Routes;
