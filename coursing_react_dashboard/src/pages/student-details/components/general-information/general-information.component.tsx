/* eslint-disable no-nested-ternary */
import { Box, CardMedia, Typography } from '@mui/material';
import { IStudentDetails } from 'apis/student/student.interfaces';
import { StudentGender, studentType } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { useTranslation } from 'react-i18next';
import { getImageServerLink } from 'utils/helpers';

type Props = {
  studentInfo: IStudentDetails | null;
};

function GeneralInformationSection({ studentInfo }: Props) {
  const { t } = useTranslation();
  return (
    <Box
      py={6}
      width="100%"
      mx="auto"
      textAlign="center"
      sx={{ display: { xs: 'none', md: 'block' } }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            py: 2,
          }}
        >
          {t('students.generalInfo')}
        </Typography>
      </Box>
      <Box>
        <CardMedia
          sx={{
            aspectRatio: '1 / 1',
            width: 170,
            borderRadius: 25,
            m: 'auto',
          }}
          component="img"
          image={
            studentInfo?.imageUrl?.length
              ? getImageServerLink(String(studentInfo?.imageUrl))
              : '/assets/images/book.png'
          }
          alt="Profile Pictiure"
        />
        <Box sx={{ pt: 3 }}>
          <Typography fontSize={22} fontWeight={600} px={1}>
            {studentInfo?.firstName} {studentInfo?.lastName}
          </Typography>
          <Typography>
            {getNameById(studentType, String(studentInfo?.studentType))}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ py: 4, mx: 'auto' }}>
        <Box sx={{ display: 'flex', py: 0.5 }}>
          <Typography fontWeight={600} px={1}>
            {t('users.phoneNumber')} :{' '}
          </Typography>
          <Typography>{studentInfo?.phoneNumber}</Typography>
        </Box>
        <Box sx={{ display: 'flex', py: 0.5 }}>
          <Typography fontWeight={600} px={1}>
            {t('students.gender')} :{' '}
          </Typography>
          <Typography>
            {t(getNameById(StudentGender, String(studentInfo?.gender)))}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', py: 0.5 }}>
          <Typography fontWeight={600} px={1}>
            {t('students.code')} :{' '}
          </Typography>
          <Typography>{String(studentInfo?.code)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', py: 0.5 }}>
          <Typography fontWeight={600} px={1}>
            {t('students.city')} :{' '}
          </Typography>
          <Typography>{studentInfo?.city?.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', py: 0.5 }}>
          <Typography fontWeight={600} px={1}>
            {t('students.country')} :{' '}
          </Typography>
          <Typography>{studentInfo?.city?.country?.name}</Typography>
        </Box>
        {studentInfo?.studentType === 1 ? (
          <Box sx={{ display: 'flex', py: 0.5 }}>
            <Typography fontWeight={600} px={1}>
              {t('grades.grade')} :{' '}
            </Typography>
            <Typography>{studentInfo?.grade?.name}</Typography>
          </Box>
        ) : studentInfo?.studentType === 2 ? (
          <>
            <Box sx={{ display: 'flex', py: 0.5 }}>
              <Typography fontWeight={600} px={1}>
                {t('students.university')} :{' '}
              </Typography>
              <Typography>{studentInfo?.college?.university?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', py: 0.5 }}>
              <Typography fontWeight={600} px={1}>
                {t('students.college')} :{' '}
              </Typography>
              <Typography>{studentInfo?.college?.name}</Typography>
            </Box>
          </>
        ) : (
          <>
            {/* <Box sx={{ display: 'flex', py: 0.5 }}>
              <Typography fontWeight={600} px={1}>
                {t('students.university')} :{' '}
              </Typography>
              <Typography>{studentInfo?.college?.university?.name}</Typography>
            </Box> */}
            {/* <Box sx={{ display: 'flex', py: 0.5 }}>
              <Typography fontWeight={600} px={1}>
                {t('students.college')} :{' '}
              </Typography>
              <Typography>{studentInfo?.college?.name}</Typography>
            </Box> */}
          </>
        )}
      </Box>
    </Box>
  );
}

export default GeneralInformationSection;
