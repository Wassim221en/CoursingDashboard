import { DragControls, Reorder, useDragControls } from 'framer-motion';
import { ReactNode } from 'react';

type DragItemProps = Omit<
  Parameters<typeof Reorder.Item>[0],
  'children' | 'dragListener'
> & { children?: ReactNode | ((controls: DragControls) => ReactNode) };

const DragItem = ({ children, ...props }: DragItemProps) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      as="div"
      dragListener={typeof children !== 'function'}
      dragControls={controls}
    >
      {typeof children === 'function' ? children(controls) : children}
    </Reorder.Item>
  );
};

export default DragItem;
