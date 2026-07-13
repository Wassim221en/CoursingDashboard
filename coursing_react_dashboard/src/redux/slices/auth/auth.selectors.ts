import { RootState } from '../../store';

const selectIsLoggedIn = ({ auth }: RootState) => Boolean(auth.token);

const authSelectors = {
  selectIsLoggedIn,
};

export default authSelectors;
