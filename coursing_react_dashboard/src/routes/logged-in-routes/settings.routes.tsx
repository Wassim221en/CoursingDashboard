import { lazy } from 'react';
import routesNames from 'routes/constants';
import TRoute from 'routes/types';

const CountryPage = lazy(() => import('pages/country/country.page'));
const CityPage = lazy(() => import('pages/city/city.page'));
const SalesPointPage = lazy(() => import('pages/sales-point/sales-point.page'));

const SalesPointDetailsPage = lazy(
  () => import('pages/sales-point-details/sales-point-details.page'),
);

const CourisngInfoPage = lazy(
  () => import('pages/coursing-info/coursing-info.page'),
);

const settingsRoutes: TRoute[] = [
  {
    path: routesNames.cities,
    element: <CityPage />,
  },
  {
    path: routesNames.countries,
    element: <CountryPage />,
  },
  {
    path: routesNames.salesPoint,
    element: <SalesPointPage />,
  },
  {
    path: `${routesNames.salesPoint}/:id`,
    element: <SalesPointDetailsPage />,
  },
  {
    path: routesNames.coursingInfo,
    element: <CourisngInfoPage />,
  },
];

export default settingsRoutes;
