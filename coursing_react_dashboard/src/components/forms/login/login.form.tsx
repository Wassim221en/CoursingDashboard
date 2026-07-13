import { ILoginPayload } from 'apis/auth/auth.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';

function LoginForm({ onSubmit }: { onSubmit: TSubmitHandler<ILoginPayload> }) {
  const { GenericForm } = useGenericForm<ILoginPayload>({
    inputs: [
      {
        name: 'userName',
        defaultValue: '',
        label: 'Username',
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'password',
        defaultValue: '',
        label: 'Password',
        type: 'text',
        isPassword: true,
        required: true,
        min: 6,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default LoginForm;

