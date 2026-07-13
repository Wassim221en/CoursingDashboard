import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import {
  IGraduationProjectPayloadForm,
  IGraduationProject,
} from 'apis/graduation-project/graduation-project.interfaces';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';
import { getNameById } from 'hooks/use-generic-form/helpers';
import collegeQueries from 'apis/college/college.queries';
import { useState } from 'react';
import { Years } from 'constants/constants';
import { useTranslation } from 'react-i18next';

function GraduationProjectForm({
  onSubmit,
  editItem,
}: {
  onSubmit: TSubmitHandler<IGraduationProjectPayloadForm>;
  editItem: IGraduationProject | null;
}) {
  const { t } = useTranslation();
  const [collegeId, setCollegeId] = useState(0);

  const { data: colleges, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery();

  const { GenericForm } = useGenericForm<IGraduationProjectPayloadForm>({
    inputs: [
      {
        name: 'title',
        defaultValue: editItem?.title || '',
        label: t('yearlyProjects.name'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'description',
        defaultValue: editItem?.description || '',
        label: t('yearlyProjects.description'),
        type: 'text',
        required: true,
        md: 12,
      },
      {
        name: 'collegeId',
        defaultValue: editItem?.college
          ? {
              id: editItem.college.id,
              name: editItem.college.name,
            }
          : null,
        label: t('yearlyProjects.college'),
        type: 'select',
        required: true,
        options:
          colleges?.data?.map((grade) => ({
            id: grade.id,
            name: grade.name,
          })) || [],
        md: 12,
        isLoading: isLoadingCollege,
        onChange: (val) => setCollegeId(val?.id || 0),
      },

      {
        name: 'year',
        defaultValue: editItem?.year
          ? {
              id: editItem?.year,
              name: t(getNameById(Years, String(editItem?.year))),
            }
          : null,
        label: t('yearlyProjects.year'),
        type: 'select',
        required: true,
        md: 12,
        options: Years.map((year) => ({
          id: year.id,
          name: t(year.name),
        })),
      },
      {
        name: 'files',
        defaultValue: editItem?.filesUrl
          ? editItem?.filesUrl.map((file) =>
              convertPhotoUrlToFileUploaderFile(file),
            )
          : [],
        label: 'Files',
        type: 'all',
        required: true,
        md: 12,
        cropRatio: 1,
        isMulti: true,
        limitFileSize: false,
      },
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default GraduationProjectForm;
