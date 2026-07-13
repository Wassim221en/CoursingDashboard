import TRoute from 'routes/types';
import otherRoutes from './other.routes';
import schoolSittingsRoutes from './school-settings.routes';
import settingsRoutes from './settings.routes';
import accountsRoutes from './accounts.routes';
import specializedSittingsRoutes from './specialized-settings.routes';
import universitiesSittingsRoutes from './universities-settings.routes';

const loggedInRoutes: TRoute[] = [
  ...settingsRoutes,
  ...universitiesSittingsRoutes,
  ...specializedSittingsRoutes,
  ...schoolSittingsRoutes,
  ...accountsRoutes,
  ...otherRoutes,
];

export default loggedInRoutes;
