import { Stack } from '@mui/material';
import React from 'react';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import CollapseItem, {
  TCollapseItem,
} from './components/collapse-item/collapse-item.component';

type Props = {
  items: TCollapseItem[];
  handleEditClick: (data: TCollapseItem) => void;
  handleRemoveClick: (id: number) => void;
  permissionName: IWebContentEnName;
};

function CollapseList({
  items,
  handleEditClick,
  handleRemoveClick,
  permissionName,
}: Props) {
  return (
    <Stack gap={1}>
      {items.map((item) => (
        <CollapseItem
          permissionName={permissionName}
          key={item.id}
          item={item}
          handleEditClick={handleEditClick}
          handleRemoveClick={handleRemoveClick}
        />
      ))}
    </Stack>
  );
}

export default CollapseList;
