import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  SxProps,
  Typography,
} from '@mui/material';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import ActionCellButtons from 'components/common/action-cell-buttons/action-cell-buttons.component';
import React, { useState } from 'react';
import { sanitizeHtml } from 'utils/helpers';

const ITEM: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
};

export type TCollapseItem = {
  id: number;
  title: string;
  description: string;
};

type Props = {
  item: TCollapseItem;
  handleEditClick: (data: TCollapseItem) => void;
  handleRemoveClick: (id: number) => void;
  permissionName: IWebContentEnName;
};

function CollapseItem({
  item,
  handleEditClick,
  handleRemoveClick,
  permissionName,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      sx={{
        width: '100%',
        fontSize: 30,
      }}
      expanded={expanded}
    >
      <AccordionSummary>
        <Box sx={ITEM}>
          <Box display="flex" width="100%" onClick={handleExpandClick}>
            <Typography fontWeight="bold">
              {sanitizeHtml(item.title)}
            </Typography>
          </Box>
          <Box display="flex">
            <ActionCellButtons
              data={null}
              permissionName={permissionName}
              handleEditClick={() => handleEditClick(item)}
              handleRemoveClick={() => handleRemoveClick(item.id)}
            />
            <IconButton
              onClick={handleExpandClick}
              sx={{
                transform: !expanded ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: '0.2s',
                pt: 1.4,
              }}
            >
              <ExpandMore sx={{ color: '#000a' }} />
            </IconButton>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography fontWeight="bold" color="gray">
          {sanitizeHtml(item.description)}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export default CollapseItem;
