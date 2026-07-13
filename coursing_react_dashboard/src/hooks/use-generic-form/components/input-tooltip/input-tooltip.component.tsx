/* eslint-disable react/jsx-props-no-spreading */
import { QuestionMark } from '@mui/icons-material';
import { Tooltip, TooltipProps } from '@mui/material';
import React from 'react';

type Props = Omit<TooltipProps, 'children'>;

const InputTooltip = (props: Props) => (
  <Tooltip {...props}>
    <QuestionMark style={{ cursor: 'help', opacity: 0.8 }} fontSize="small" />
  </Tooltip>
);

export default InputTooltip;
