import { Box, IconButton, Button } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import { ICourseQuestion } from 'apis/course/course.interfaces';
import { Reorder } from 'framer-motion';
import { DragHandle } from '@mui/icons-material';
import CollapseQuestionItem from './collapse-question-item/collapse-item.component';
import DragItem from '../drag-item/drag-item.component';

type Props = {
  items: (ICourseQuestion & { idx: number })[];
  handleRemoveClick: (id: number) => void;
  handleEditClick: (question: string, id: number) => void;
  handleOrderChange?: (
    questionsOrder: { question: ICourseQuestion; orderOffset: number }[],
  ) => void;
  permissionName: IWebContentEnName;
};

function CollapseQuestionList({
  items,
  handleRemoveClick,
  handleEditClick: handleEditQuestionClick,
  handleOrderChange,
  permissionName,
}: Props) {
  const [listItems, setListItems] = useState(items);
  const isReordered = useMemo(
    () => !Object.is(items, listItems),
    [items, listItems],
  );
  const newOrder = useMemo(
    () =>
      listItems
        .map((originalItem, idx) => ({
          question: originalItem,
          orderOffset: originalItem.idx - idx,
        }))
        .filter((question) => question.orderOffset !== 0),
    [listItems],
  );
  // to perserve refrence equality
  useEffect(() => setListItems(items), [items]);

  return (
    <>
      {isReordered && handleOrderChange && (
        <>
          <Button color="error" onClick={() => setListItems(items)}>
            Reset order
          </Button>
          <Button onClick={() => handleOrderChange(newOrder)}>
            update order
          </Button>
        </>
      )}
      <Reorder.Group
        values={listItems}
        onReorder={setListItems}
        style={{ padding: 0 }}
      >
        {listItems.map((item) =>
          handleOrderChange ? (
            <DragItem
              value={item}
              key={item.id}
              style={{ paddingBottom: '1rem' }}
            >
              {(controls) => (
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <IconButton onPointerDown={(e) => controls.start(e)}>
                    <DragHandle />
                  </IconButton>
                  <CollapseQuestionItem
                    handleEditQuestionClick={handleEditQuestionClick}
                    item={item}
                    handleRemoveClick={handleRemoveClick}
                    permissionName={permissionName}
                  />
                </Box>
              )}
            </DragItem>
          ) : (
            <Box key={item.id} sx={{ paddingBottom: '1rem' }}>
              <CollapseQuestionItem
                handleEditQuestionClick={handleEditQuestionClick}
                item={item}
                handleRemoveClick={handleRemoveClick}
                permissionName={permissionName}
              />
            </Box>
          ),
        )}
      </Reorder.Group>
    </>
  );
}

export default CollapseQuestionList;
