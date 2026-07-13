// import { ICountry, ICountryPayload } from "apis/country/country.interfaces";
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { IRoom, IRoomPayloadForm } from 'apis/room/room.interfaces';
import instructorQueries from 'apis/instructor/instructor.queries';
import { useTranslation } from 'react-i18next';

function RoomsForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IRoomPayloadForm>;
  editItem: IRoom | null;
}) {
  const { data: instructors, isLoading } =
    instructorQueries.useInstructorQuery();

  const { t } = useTranslation();

  const { GenericForm } = useGenericForm<IRoomPayloadForm>({
    inputs: [
      {
        name: 'adminId',
        defaultValue: editItem?.admin || null,
        label: t('common.instructors'),
        type: 'select',
        options:
          instructors?.data?.map((instructor) => ({
            id: instructor.id,
            name: instructor.fullName,
          })) || [],
        isLoading,
        required: true,
        md: 12,
      },
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('rooms.roomName'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'password',
        defaultValue: editItem?.password || '',
        label: t('rooms.password'),
        type: 'text',
        required: true,
        md: 12,
        isPassword: !!editItem?.password,
        min: 6,
      },
      {
        name: 'description',
        defaultValue: editItem?.description || '',
        label: t('rooms.description'),
        type: 'text',
        required: true,
        html: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default RoomsForm;
