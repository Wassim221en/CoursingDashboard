import {
  IVideoSectionPayloadForm,
  IVideoSection,
} from 'apis/video-sections/video-sections.interface';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import {
  convertPhotoUrlToFileUploaderFile,
  getDateFromObject,
} from 'utils/helpers';

function VideoSectionsForm({
  onSubmit,
  editItem,
  minDate,
}: {
  onSubmit: TSubmitHandler<IVideoSectionPayloadForm>;
  editItem: IVideoSection | null;
  minDate?: Date;
}) {
  const { t } = useTranslation();

  const { GenericForm } = useGenericForm<IVideoSectionPayloadForm>({
    inputs: [
      {
        name: 'title',
        type: 'text',
        defaultValue: editItem?.title ?? '',
        label: t('video-section-form.title'),
        required: true,
        md: 12,
      },
      {
        name: 'timeBegin',
        type: 'date',
        defaultValue: editItem?.timeOfBegin
          ? getDateFromObject({
              houres: editItem?.timeOfBegin.houres,
              minutes: editItem?.timeOfBegin.minutes,
              seconds: editItem?.timeOfBegin.seconds,
            })
          : null,
        label: t('video-section-form.time-of-begin'),
        required: true,
        isTime: true,
        md: 12,
        inputFormat: 'HH:mm:ss',
        minDate,
        ampm: false,
      },
      {
        name: 'order',
        type: 'number',
        defaultValue: editItem?.order ?? 1,
        label: t('video-sections.order'),
        min: 1,
        required: true,
        md: 12,
      },
      {
        name: 'files',
        defaultValue: editItem?.imageUrl
          ? [convertPhotoUrlToFileUploaderFile(editItem?.imageUrl)]
          : [],
        label: t('common.image'),
        type: 'images',
        required: true,
        limitFileSize: false,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default VideoSectionsForm;
