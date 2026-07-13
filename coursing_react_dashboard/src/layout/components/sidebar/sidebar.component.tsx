/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-array-index-key */
import React, { useMemo, useState } from 'react';
import {
  Divider,
  Drawer,
  List,
  IconButton,
  useTheme,
  styled,
  SxProps,
  Box,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { store } from 'redux/store';
import useDebounce from 'hooks/use-debounce/useDebounce';
import SideBarFilter from 'components/common/sidebar-filter/sidebar-filter.component';
import useSideLinks, { TRouteLink } from './use-sidebar-links';
import SidebarItem from '../sidebar-item/sidebar-item.component';

export const drawerWidth = 290;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const DRAWER: SxProps = {
  position: 'relative',
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#FAFAFB',
    border: '2px solid #fff',
    boxShadow: 'inset -2px 0px 3px rgb(15 31 68 / 6%)',
    px: 1,
    overflow: 'auto',
    '::-webkit-scrollbar': { display: 'none' },
  },
};

type Props = {
  open: boolean;
  handleDrawerClose: () => void;
};

function Sidebar({ handleDrawerClose, open }: Props) {
  const theme = useTheme();
  const routeLinks = useSideLinks();

  const [query, setQuery] = useState('');

  const { permissions } = store.getState().auth;

  const allPermissions = permissions?.webContentsForDashboardRole?.permissions;

  const allowedControllers = useMemo(
    () =>
      allPermissions?.base
        ? [
            ...allPermissions.base,
            ...allPermissions.schooling.base,
            ...allPermissions.schooling.setting,
            ...allPermissions.setting,
            ...allPermissions.specialty.base,
            ...allPermissions.specialty.setting,
            ...allPermissions.university.base,
            ...allPermissions.university.setting,
          ].filter((wc) => wc.canView === true)
        : [],

    [allPermissions],
  );

  const FILTER = (links: TRouteLink[]) =>
    links
      .filter(
        (l) =>
          l.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
          !!FILTER(l?.linkChildren || []).length,
      )
      .map((l) => ({
        ...l,
        linkChildren: FILTER(l?.linkChildren || []),
      }));

  const AllowedLinks = routeLinks.filter((route) =>
    allowedControllers?.find(
      (webContent) =>
        webContent.enName === route.controllerName ||
        route.linkChildren?.find(
          (childLink) => childLink.controllerName === webContent.enName,
        ) ||
        route.linkChildren?.flatMap((f) =>
          f.linkChildren?.find((e) => e.controllerName === webContent.enName),
        ),
    ),
  );

  const sideBarLinks = query.length ? FILTER(AllowedLinks) : AllowedLinks;

  return (
    <Drawer sx={DRAWER} variant="persistent" anchor="left" open={open}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          width: drawerWidth - 20,
          zIndex: 90,
          bgcolor: '#FAFAFB',
        }}
      >
        <DrawerHeader
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            bgcolor: '#red',
            backgroundImage: 'linear-gradient(45deg, #020691, #96D2F2)',
            backgroundSize: '100%',
            backgroundRepeat: 'repeat',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
          }}
        >
          <LazyLoadImage
            style={{
              margin: 'auto',
              width: 160,
              height: 30,
              borderRadius: 4,
            }}
            src="/assets/logo/side-bar-logo.png"
          />

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <SideBarFilter query={query} setQuery={setQuery} />
        <Divider />
      </Box>

      <List>
        {sideBarLinks.map(({ text, icon, link, linkChildren }, index) => (
          <SidebarItem
            key={text + link + index}
            icon={icon}
            text={text}
            link={link}
            allowedControllers={allowedControllers}
            linkChildren={linkChildren?.filter((route) =>
              allowedControllers?.find(
                (webContent) =>
                  webContent.enName === route.controllerName ||
                  route.linkChildren?.find(
                    (childLink) =>
                      childLink.controllerName === webContent.enName,
                  ),
              ),
            )}
          />
        ))}
        {/* {routeLinks.map(({ text, icon, link, linkChildren }, index) => (
          <SidebarItem
            key={text + link + index}
            icon={icon}
            text={text}
            link={link}
            linkChildren={linkChildren}
          />
        ))} */}
      </List>
    </Drawer>
  );
}

export default Sidebar;
