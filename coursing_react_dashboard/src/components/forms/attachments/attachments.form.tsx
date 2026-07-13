// import { ICountry, ICountryPayload } from "apis/country/country.interfaces";
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import {
  IAttachments,
  IAttachmentsPayloadForm,
} from 'apis/attachments/attachments.interfaces';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';
import { useTranslation } from 'react-i18next';

function AttachmentsForm({
  onSubmit,
  editItem,
  progress,
  onAbortClick,
}: {
  onSubmit: TSubmitHandler<IAttachmentsPayloadForm>;
  editItem: IAttachments | null;
  progress: number | undefined;
  onAbortClick?: () => void;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<IAttachmentsPayloadForm>({
    inputs: [
      {
        name: 'title',
        defaultValue: editItem?.title || '',
        label: t('common.title'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: '_count',
        defaultValue: 0,
        label: t('common.count'),
        type: 'number',
        required: true,
        hidden: false,
        md: 12,
      },
      {
        name: 'files',
        defaultValue: editItem?.fileUrl
          ? [convertPhotoUrlToFileUploaderFile(editItem?.fileUrl)]
          : [],
        label: 'Attachments File',
        type: 'all',
        required: true,
        md: 12,
        cropRatio: 1,
        limitFileSize: false,
      },
    ],
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
  });

  return GenericForm;
}

export default AttachmentsForm;
