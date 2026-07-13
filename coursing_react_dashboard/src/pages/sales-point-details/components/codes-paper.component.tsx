import { Box } from '@mui/material';
import { IPointsCodes } from 'apis/sales-point/sales-point.interfaces';
import { forwardRef } from 'react';
import CodeCardComponent from './code-card.component';

type Props = {
  codes: IPointsCodes[];
  address?: string;
};

const CodespaperComponent = ({ codes, address }: Props, fRef: any) => (
  <Box
    ref={fRef}
    sx={{
      display: 'grid',
      gridTemplateColumns: '50vw 50vw',
    }}
  >
    {codes
      .filter((code) => code.codeStatus === 1) // only Active
      .map((code) => (
        <CodeCardComponent
          code={code.code}
          points={code.point}
          key={code.id}
          address={address}
        />
      ))}
  </Box>
);

export default forwardRef(CodespaperComponent);
