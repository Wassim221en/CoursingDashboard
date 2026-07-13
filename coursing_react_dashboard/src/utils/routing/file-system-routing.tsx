// @ts-nocheck
// this file is not used now
// will be used in the future (I guess?)

import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import ErrorPlaceholder from 'components/common/placeholders/error-placeholder/error-placeholder.component';
import { MainPaths } from 'constants/values';
import Wrapper from 'layout/components/wrapper/wrapper.component';
import {
  calcPagePath,
  defaultLoader,
  pages,
} from './file-system-routing.helpers';

const Custom404 = lazy(() => import('pages/error-pages/not-found.page'));

const pagesRoutes: RouteObject[] = Object.entries(pages).map<RouteObject>(
  ([pagePath, pageElement]) => {
    const Component = lazy(pageElement as any);
    const path = calcPagePath(pagePath);
    const loader = defaultLoader(path, pageElement);
    return {
      element: <Component />,
      path,
      loader,
    };
  },
);

const RouteObjects: RouteObject[] = [
  {
    element: <Wrapper />,
    errorElement: <ErrorPlaceholder />,
    children: [
      {
        // error page
        path: '*',
        element: <Custom404 />,
      },
      {
        // for redirecting
        path: MainPaths.ROOT_PATH,
        loader: defaultLoader('', () => Promise.resolve()),
      },
      ...pagesRoutes,
    ],
  },
];

const DashboardRouter = createBrowserRouter(RouteObjects);

export default DashboardRouter;
