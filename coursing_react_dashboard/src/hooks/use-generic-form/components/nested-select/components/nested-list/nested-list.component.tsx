/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useCallback, useEffect, memo } from 'react';
import List from '@mui/material/List';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Collapse,
  Box,
  ListItemText,
  IconButton,
  Checkbox,
} from '@mui/material';
import { TNestedItem } from 'hooks/use-generic-form/types';

interface NestedListProps {
  item: TNestedItem;
  isSubItem?: boolean;
  onCheck: (id: number | null) => void;
  checkedValue: number | number[] | null;
  disabled?: boolean;
}

const NestedList: React.FC<NestedListProps> = ({
  item,
  isSubItem,
  onCheck,
  checkedValue,
  disabled,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleChange = useCallback(
    (selectedItem: TNestedItem | null) => {
      if (selectedItem?.id) {
        onCheck(selectedItem.id);
      } else {
        onCheck(null);
      }
    },
    [onCheck],
  );

  useEffect(() => {
    if (checkedValue === item.id) {
      setOpen(true);
    }
  }, [checkedValue, item.id]);

  return (
    <List sx={{ width: '100%' }} component="nav">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          onChange={(e) => {
            if (e.target.checked) {
              handleChange(item);
            } else {
              handleChange(null);
            }
          }}
          disabled={disabled}
          checked={checkedValue === item.id}
        />
        <ListItemText primary={item.name} />
        {!!item.children.length && (
          <IconButton onClick={handleClick}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      {item.children?.map((subItem, idx) => (
        <Collapse
          key={(subItem.id + subItem.name + subItem.parentId, idx)}
          in={open}
          timeout="auto"
          unmountOnExit
        >
          <Box sx={{ pl: isSubItem ? 4 : 2 }}>
            <NestedList
              onCheck={onCheck}
              checkedValue={checkedValue}
              isSubItem
              item={subItem}
              disabled={disabled}
            />
          </Box>
        </Collapse>
      ))}
    </List>
  );
};

export default memo(NestedList);
