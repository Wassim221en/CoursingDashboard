// @ts-nocheck
// this file is not used now
// will be used in the future (I guess?)

/* eslint-disable react/jsx-props-no-spreading */
import { NoData, UnauthorizedPlaceholder } from 'components/placeholders';
import { AnimatePresence, motion } from 'framer-motion';
import { useWebsiteStore } from 'zustand/stores';
import { Warning } from '@mui/icons-material';
import { PageWithPermissions } from './with-permissions.types';

function withPermissions<T extends {}>(Page: PageWithPermissions<T>) {
  function PermissionsHOC(props: T) {
    const { currentPagePermission } = useWebsiteStore();
    return (
      <AnimatePresence>
        {[null, undefined].includes(currentPagePermission as any) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'grid',
              placeItems: 'center',
              alignContent: 'center',
              gap: '1rem',
              height: '80vh',
            }}
          >
            <Warning style={{ fontSize: '8rem' }} />
            <NoData height="fit-content" text="Couldn't fetch permissions" />
          </motion.div>
        ) : (
          !currentPagePermission?.canView && <UnauthorizedPlaceholder />
        )}
        {currentPagePermission?.canView && (
          <Page
            canEdit={currentPagePermission.canEdit}
            canAdd={currentPagePermission.canAdd}
            canDelete={currentPagePermission.canDelete}
            {...props}
          />
        )}
        z``
      </AnimatePresence>
    );
  }
  PermissionsHOC.displayName = 'PermissionsHOC';
  return PermissionsHOC;
}

export default withPermissions;
