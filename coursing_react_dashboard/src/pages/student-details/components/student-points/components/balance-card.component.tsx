import { Box, Button, Input, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import studentApi from 'apis/student/student.api';
import { showError, showSuccess } from 'libs/react.toastify';

type Props = {
  balance: number;
  studentId: number;
  refetch: () => void;
};

function Balancecard({ balance, studentId, refetch }: Props) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [balanceInput, setBalanceInput] = useState(balance);
  const handleSave = async () => {
    // TODO: Implement save logic
    try {
      await studentApi.updateStudentBalance({
        points: balanceInput,
        studentId,
      });
      setIsEditing(false);
      showSuccess(t('students.pointsBalanceUpdated'));
      refetch();
    } catch (error) {
      console.error(error);
      showError(t('students.pointsBalanceUpdateFailed'));
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box
        sx={{
          height: 100,
          width: 400,
          boxShadow: 4,
          borderRadius: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ p: 2 }}>
            <Typography> {t('students.pointsBalance')} </Typography>
            {isEditing ? (
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 30,
                  py: 1,
                  display: 'flex',
                  gap: 2,
                }}
              >
                <Input
                  placeholder="Enter balance"
                  value={balanceInput}
                  type="number"
                  onChange={(e) => setBalanceInput(Number(e.target.value))}
                  sx={{ fontWeight: 600, fontSize: 30 }}
                />

                <Button
                  onClick={() => setIsEditing(false)}
                  sx={{ fontWeight: 300, fontSize: 20, py: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSave()}
                  sx={{
                    fontWeight: 300,
                    fontSize: 20,
                    py: 1,
                  }}
                >
                  Save
                </Button>
              </Typography>
            ) : (
              <Typography
                onClick={() => setIsEditing(true)}
                sx={{ fontWeight: 600, fontSize: 30, py: 1 }}
              >
                {balance}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              background:
                'linear-gradient(to left bottom, #66ffff , #3333ff );',
              height: '100px',
              width: 100,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <TimelineIcon sx={{ mx: 'auto', color: 'white', fontSize: 50 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Balancecard;
