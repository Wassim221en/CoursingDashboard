// import { ICountry, ICountryPayload } from "apis/country/country.interfaces";
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { IUserRoomPayloadForm } from 'apis/room/room.interfaces';
import studentQueries from 'apis/student/student.queries';

function MembersForm({
  onSubmit,
}: {
  onSubmit: TSubmitHandler<IUserRoomPayloadForm>;
}) {
  const { data: students, isLoading } = studentQueries.useStudentsQuery();

  const { GenericForm } = useGenericForm<IUserRoomPayloadForm>({
    inputs: [
      {
        name: 'users',
        defaultValue: null,
        label: 'member',
        type: 'select',
        options:
          students?.data?.map((item) => ({
            name: item.fullName,
            id: item.id,
          })) || [],
        isLoading,
        required: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default MembersForm;
