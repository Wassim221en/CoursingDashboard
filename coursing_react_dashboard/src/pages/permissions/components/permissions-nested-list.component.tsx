import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { IWebContents } from 'apis/permissions/permissions.interfaces';
import { useState } from 'react';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import GradeIcon from '@mui/icons-material/Grade';
import PermissionsListItem from './permissions-list.component';

type Props = {
  listName: string;
  base?: IWebContents[];
  settings?: IWebContents[];
  changeWebBaseItem: (item: IWebContents) => void;
  changeWebSettingItem: (item: IWebContents) => void;
};

function PermissionsNestedListItem({
  base,
  settings,
  listName,
  changeWebBaseItem,
  changeWebSettingItem,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const [expandedSettings, setExpandedSettings] = useState(false);

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
          <IconButton edge="start">
            <GradeIcon />
          </IconButton>
          <ListItemText primary={listName} sx={{ fontWeight: 600 }} />
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {base?.map((b) => (
          <PermissionsListItem
            key={b.id}
            item={b}
            changeWebItem={changeWebBaseItem}
          />
        ))}

        {/* {settings?.length && ( */}
        <Box sx={{ mx: 3 }}>
          <ListItem
            onClick={() => setExpandedSettings((prev) => !prev)}
            secondaryAction={
              <IconButton edge="end">
                {expandedSettings ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton dense disableRipple>
              <IconButton edge="start">
                <SettingsSuggestIcon />
              </IconButton>
              <ListItemText primary="settings" sx={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
          <Collapse in={expandedSettings} timeout="auto" unmountOnExit>
            {settings?.map((b) => (
              <PermissionsListItem
                key={b.id}
                item={b}
                changeWebItem={changeWebSettingItem}
              />
            ))}
          </Collapse>
        </Box>
        {/* )} */}
      </Collapse>
    </Box>
  );
}

export default PermissionsNestedListItem;
