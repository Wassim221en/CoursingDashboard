/* eslint-disable react-hooks/exhaustive-deps */
import { Box, SxProps } from '@mui/material';
import { ILoginPayload } from 'apis/auth/auth.interfaces';
import LoginForm from 'components/forms/login/login.form';
import { showSuccess } from 'libs/react.toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'redux/hooks';
import authThunks from 'redux/slices/auth/auth.thunks';
import ThemeVariables from 'theme/theme-variables';

const CONTAINER: SxProps = {
  display: 'flex',
  height: '100vh',
};

const FORM_CONTAINER: SxProps = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  width: '50%',
  pl: 20,
};

const IMAGE_CONTAINER: SxProps = {
  height: '100%',
  width: '35%',
  background: ThemeVariables.PRIMARY_COLOR,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLoginSubmit = async ({ data }: { data: ILoginPayload }) => {
    try {
      await dispatch(authThunks.loginAsync(data)).unwrap();
      showSuccess(t('common.welcome'));
      navigate('/welcome', { replace: true });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <Box sx={CONTAINER}>
      <Box sx={IMAGE_CONTAINER}>
        <img
          src="/assets/images/coursing.png"
          alt="coursing login page"
          style={{
            objectFit: 'contain',
          }}
        />
      </Box>
      <Box sx={FORM_CONTAINER}>
        <LoginForm onSubmit={handleLoginSubmit} />
      </Box>
    </Box>
  );
}

export default Login;
