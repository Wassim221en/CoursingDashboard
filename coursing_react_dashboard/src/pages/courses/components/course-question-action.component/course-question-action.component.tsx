import {
  IAttachments,
  IAttachmentsPayloadForm,
} from 'apis/attachments/attachments.interfaces';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import React from 'react';
import { useTranslation } from 'react-i18next';

function CourseQuestionAction({
  onSubmit,
  editItem,
}: // progress,
// onAbortClick,
{
  onSubmit: TSubmitHandler<IAttachmentsPayloadForm>;
  editItem: IAttachments | null;
  // progress: number | undefined;
  // onAbortClick?: () => void;
}) {
  const { t } = useTranslation();
  const { GenericForm } = useGenericForm<IAttachmentsPayloadForm>({
    inputs: [
      {
        name: 'title',
        defaultValue: editItem?.title || '',
        label: t('faqs.addFaq'),
        type: 'text',
        required: true,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });
  return GenericForm;
}

export default CourseQuestionAction;
