import { Button, ButtonGroup, LinearProgress } from '@mui/material';
import { Close } from '@mui/icons-material';

type TProgressButton = {
  children?: string;
  onClick?: (e: any) => void;
  onCancel?: (e: any) => void;
  //   disabled?: boolean | 'mainBtn' | 'cancelBtn';
  disableMainBtn?: boolean;
  disableCancelBtn?: boolean;
  progressPercent?: number;
};

function ProgressButton({
  children,
  onClick,
  onCancel,
  //   disabled,
  disableMainBtn,
  disableCancelBtn,
  progressPercent,
}: TProgressButton) {
  return (
    <ButtonGroup fullWidth variant="contained" sx={{ boxShadow: 'none' }}>
      <Button
        onClick={onClick}
        disabled={disableMainBtn}
        sx={
          progressPercent !== undefined
            ? {
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'space-between',
                padding: 0,
              }
            : undefined
        }
      >
        <span
          style={
            progressPercent !== undefined
              ? { display: 'block', padding: 2 }
              : undefined
          }
        >
          {children}
        </span>
        <LinearProgress
          sx={{
            color: 'inherit',
            margin: '1px',
          }}
          color="inherit"
          variant={progressPercent ? 'determinate' : 'indeterminate'}
          value={progressPercent}
        />
      </Button>
      {onCancel && (
        <Button
          disabled={disableCancelBtn}
          sx={{ width: 'fit-content' }}
          color="error"
          onClick={onCancel}
        >
          <Close />
        </Button>
      )}
    </ButtonGroup>
  );
}

export default ProgressButton;
