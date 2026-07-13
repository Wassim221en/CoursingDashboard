/* eslint-disable react/jsx-wrap-multilines */
import { IWebContents } from 'apis/permissions/permissions.interfaces';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { FC, useCallback, useState } from 'react';

interface IPermissionsListItemProps {
  item: IWebContents;
  changeWebItem: (item: IWebContents) => void;
}

const PermissionsListItem: FC<IPermissionsListItemProps> = ({
  item,
  changeWebItem,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [allChecked, setAllChecked] = useState(false);

  const uncheckAllIfChecked = useCallback(
    (cb: any) => {
      if (allChecked) {
        setAllChecked(false);
      }
      cb();
    },
    [allChecked],
  );

  const permissionButtons = [
    {
      title: 'Can view',
      value: item.canView,
      onClick: () =>
        uncheckAllIfChecked(() =>
          changeWebItem({ ...item, canView: !item.canView }),
        ),
    },
    {
      title: 'Can Action',
      value: item.canAction,
      onClick: () =>
        uncheckAllIfChecked(() =>
          changeWebItem({ ...item, canAction: !item.canAction }),
        ),
    },

    {
      title: 'Can delete',
      value: item.canDelete,
      onClick: () =>
        uncheckAllIfChecked(() =>
          changeWebItem({ ...item, canDelete: !item.canDelete }),
        ),
    },
  ];

  const handleCheckAll = useCallback(
    (newChecked: boolean) => {
      setAllChecked(newChecked);
      changeWebItem({
        ...item,
        canAction: newChecked,
        canDelete: newChecked,
        canView: newChecked,
      });
    },
    [changeWebItem, item],
  );

  return (
    <Box>
      <ListItem
        onClick={() => setExpanded((prev) => !prev)}
        secondaryAction={
          <IconButton edge="end">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
        disablePadding
      >
        <ListItemButton dense disableRipple>
          <ListItemIcon>
            <Checkbox
              onChange={(e) => handleCheckAll(e.target.checked)}
              edge="start"
              checked={item.canAction && item.canDelete && item.canView}
            />
          </ListItemIcon>
          <ListItemText primary={item.enName} />
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {permissionButtons.map((pButton) => (
            <ListItem key={pButton.title}>
              <ListItemButton dense sx={{ pl: 4 }} onClick={pButton.onClick}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={pButton.value}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={pButton.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default PermissionsListItem;
