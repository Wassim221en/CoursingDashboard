/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, SxProps } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import routesNames from 'routes/constants';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import ThemeVariables from 'theme/theme-variables';
import { TRouteLink } from '../sidebar/use-sidebar-links';

const isOpened = (links: TRouteLink[], pathname: string): boolean =>
  !!links.find(
    (link) =>
      link.link === pathname || isOpened(link.linkChildren || [], pathname),
  );

function SidebarItem({
  link,
  icon,
  text,
  linkChildren,
  isChild,
  allowedControllers,
}: TRouteLink & { isChild?: boolean }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [open, setOpen] = React.useState(false);
  const { pathname } = useLocation();

  const unRegularCases =
    (pathname?.includes(routesNames.schoolLessons) &&
      link?.includes(routesNames.schoolCourses)) ||
    (pathname?.includes(routesNames.universityLessons) &&
      link?.includes(routesNames.universityCourses)) ||
    (pathname?.includes(routesNames.specializedLessons) &&
      link?.includes(routesNames.specializedCourses));

  const active = link === pathname || unRegularCases;

  useEffect(() => {
    setOpen(isOpened(linkChildren || [], pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ITEM: SxProps = {
    borderRadius: 2,
    paddingLeft: isChild ? 2 : 0.8,
    bgcolor: active ? ThemeVariables.PRIMARY_COLOR : '',
    color: active ? '#f6f6f1' : '#555B77',
    ml: 0.5,
    transition: 'all 500ms',
    ':hover': {
      bgcolor: '#c9c9fbab',
      ml: 2.5,
    },
    textAlign: lang === 'ar' ? 'start' : '',
  };

  const ICON: SxProps = {
    color: active ? '#f6f6f1' : '#555B77',
  };

  const CHILD: SxProps = {
    width: '90%',
    position: 'relative',
    left: 15,
    borderLeft: '1px solid #c9c9fbab',
  };

  const handleSelect = () => {
    setOpen(!open);
  };

  return !linkChildren?.length && link ? (
    <Link to={link}>
      <ListItem disablePadding sx={isChild ? CHILD : {}}>
        <ListItemButton onClick={handleSelect} sx={ITEM} component="div">
          <ListItemIcon sx={ICON}>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    </Link>
  ) : linkChildren?.length ? (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={handleSelect} sx={{ ...ITEM }}>
          <ListItemIcon sx={ICON}>{icon}</ListItemIcon>
          <ListItemText primary={text} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {linkChildren?.map((item, index) => (
          <SidebarItem
            key={item.text + index + item.link}
            icon={item.icon}
            link={item.link}
            text={item.text}
            linkChildren={item.linkChildren?.filter((route) =>
              allowedControllers?.find(
                (webContent) => webContent.enName === route.controllerName,
              ),
            )}
            isChild
          />
        ))}
      </Collapse>
    </>
  ) : null;
}

export default SidebarItem;
