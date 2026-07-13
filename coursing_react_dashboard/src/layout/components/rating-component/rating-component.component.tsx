import { Star, StarBorder } from '@mui/icons-material';
import { Rating, Stack } from '@mui/material';
import React from 'react'

interface IProps {
  readonly?: boolean;
  precision?: number;
  size?: "small" | "medium" | "large";
  color?: "inherit" | "disabled" | "action" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  icon?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  value: number;
  setValue?: (value: number | null) => void;
}

const RatingComponent = ({
  readonly = false,
  precision = 1,
  size = 'large',
  color = 'inherit',
  icon = <Star fontSize="inherit" color={color} />,
  emptyIcon = <StarBorder fontSize="inherit" />,
  value,
  setValue
}: IProps) => {
  const handleChange = (_e: React.SyntheticEvent<Element, Event>, v: number | null) => {
    setValue?.(v);
  };


  return (
    <Stack>
      <Rating
        value={value}
        onChange={handleChange}
        precision={precision}
        size={size}
        icon={icon}
        emptyIcon={emptyIcon}
        readOnly={readonly}
      />
    </Stack>
  )
}

export default RatingComponent