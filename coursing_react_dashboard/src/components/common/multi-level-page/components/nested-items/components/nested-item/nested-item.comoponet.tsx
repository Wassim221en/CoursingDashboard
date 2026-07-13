/* eslint-disable react/jsx-props-no-spreading */
import { Box, Stack } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SxProps } from '@mui/material/styles';
import { sanitizeHtml } from 'utils/helpers';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import Typography from '@mui/material/Typography';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import React, { useState } from 'react';
import { TNestedItemPage } from '../../nested-items.component';
import AddButton from '../add-button/add-button.component';

const BORDER: SxProps = {
  position: 'absolute',
  top: 0,
  height: '100%',
  backgroundColor: '#0002',
  width: 1.3,
  left: 20,
};

// const SUBJECT: SxProps = {
//   py: 0.7,
//   px: 1.2,
//   borderRadius: 1.8,
//   mr: 1,
//   bgcolor: "#eee",
// };

type Props = {
  item: TNestedItemPage;
  handleEditClick: (data: TNestedItemPage) => void;
  handleAddClick: (parentId?: number | null) => void;
  handleRemoveClick: (id: number) => void;
  permissionName: IWebContentEnName;
};

function NestedItem({
  item,
  handleEditClick,
  handleRemoveClick,
  handleAddClick,
  permissionName,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ITEM: SxProps = {
    ':hover': {
      bgcolor: 'rgba(23, 51, 79, 0.04)',
    },
    bgcolor: expanded ? 'rgba(23, 51, 79, 0.04)' : 'auto',
    p: 0.4,
    pl: 1.3,
    borderRadius: 2,
    cursor: 'pointer',
  };

  return (
    <Stack gap={1}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        sx={ITEM}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={handleExpandClick}
          width="100%"
        >
          <Box
            sx={{
              transform: !expanded ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: '0.2s',
              pt: 1.4,
            }}
          >
            <ExpandMoreIcon sx={{ color: '#000a' }} />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Box>
              <Typography fontWeight={600}>{item.name}</Typography>
              {item.description && (
                <Typography variant="subtitle2" mt={0.5}>
                  {sanitizeHtml(item.description)}
                </Typography>
              )}
            </Box>
            {/* {item.subject?.name && (
              <Typography variant="subtitle2" sx={SUBJECT}>
                {item.subject?.name}
              </Typography>
            )} */}
          </Box>
        </Box>

        <ActionCellButtons
          data={null}
          handleEditClick={() => handleEditClick(item)}
          handleRemoveClick={() => handleRemoveClick(item.id)}
          permissionName={permissionName}
        />
      </Box>
      <Box position="relative">
        <Box sx={BORDER} />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box ml={4}>
            {item.children.map((i) => (
              <NestedItem
                permissionName={permissionName}
                key={i.id}
                item={i}
                handleRemoveClick={handleRemoveClick}
                handleAddClick={handleAddClick}
                handleEditClick={handleEditClick}
              />
            ))}
          </Box>
          <Box ml={4} mb={1}>
            <AddButton handleAddClick={() => handleAddClick(item.id)} />
          </Box>
        </Collapse>
      </Box>
    </Stack>
  );
}

export default NestedItem;
