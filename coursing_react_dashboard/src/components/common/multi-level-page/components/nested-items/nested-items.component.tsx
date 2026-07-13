import React from 'react';
import { Box } from '@mui/material';
import { TAutoComplete, TNestedItem } from 'hooks/use-generic-form/types';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import AddButton from './components/add-button/add-button.component';
import NestedItem from './components/nested-item/nested-item.comoponet';

export type TNestedItemPage = TNestedItem & {
  description?: string | null;
  subject?: TAutoComplete | null;
};

export type TNestedItems = {
  data: TNestedItemPage[];
  handleRemoveClick: (id: number) => void;
  handleAddClick: (parentId?: number | null) => void;
  handleEditClick: (data: TNestedItemPage) => void;
  permissionName: IWebContentEnName;
};

function NestedItems({
  data,
  handleRemoveClick,
  handleAddClick,
  handleEditClick,
  permissionName,
}: TNestedItems) {
  return (
    <Box mt={2}>
      {data.map((d) => (
        <NestedItem
          permissionName={permissionName}
          key={d.id}
          item={d}
          handleRemoveClick={handleRemoveClick}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
        />
      ))}
      <AddButton handleAddClick={() => handleAddClick()} />
    </Box>
  );
}

export default NestedItems;
