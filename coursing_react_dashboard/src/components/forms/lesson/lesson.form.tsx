/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import {
  ILessonDetails,
  ILessonPayloadForm,
} from 'apis/lesson/lesson.interfaces';
import { TInput } from 'hooks/use-generic-form/types';
import FileUploader, { IFileUploaderFile } from '@craft-code/file-uploader';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import Goals from 'pages/lesson/action/components/goals/goals.component';
import { TEditGoal } from 'pages/lesson/action/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';
import { Card, Chip, IconButton } from '@mui/material';
import UnitPickerDialog from 'components/common/dialogs/unit-picker-dialog/unit-picker-dialog.component';
import { Add } from '@mui/icons-material';
import courseQueries, {
  mapUnitsToCourseUnits,
} from 'apis/course/course.queries';

function LessonForm({
  onSubmit,
  editItem,
  progress,
  onAbortClick,
  goals,
  setGoals,
  thumbnail,
  setThumbnail,
  courseId,
}: {
  courseId?: number;
  onSubmit: TSubmitHandler<ILessonPayloadForm>;
  editItem: ILessonDetails | null;
  progress: number | undefined;
  onAbortClick?: () => void;
  goals: TEditGoal[];
  setGoals: Dispatch<SetStateAction<TEditGoal[]>>;
  thumbnail: IFileUploaderFile[];
  setThumbnail: React.Dispatch<React.SetStateAction<IFileUploaderFile[]>>;
}) {
  const { data: units, isLoading } = courseQueries.useCourseUnitsQuery({
    courseId,
  });
  const { t } = useTranslation();

  const [defaultThumbnail, setDefaultThumbnail] = useState<string>('');

  const [isFreeLesson, setIsFreeLesson] = useState(false);

  useEffect(() => {
    if (editItem?.thumbnail) setDefaultThumbnail(editItem?.thumbnail);
  }, [editItem?.thumbnail]);

  const commonInputs: TInput<ILessonPayloadForm>[] = [
    {
      name: 'title',
      defaultValue: editItem?.title || '',
      label: t('lessons.title'),
      type: 'text',
      required: true,
      md: 6,
      order: 0,
    },
    {
      name: 'description',
      defaultValue: editItem?.description || '',
      label: t('lessons.description'),
      type: 'text',
      required: true,
      md: 12,
      order: 2,
      html: true,
    },
    {
      name: '_unit',
      md: 6,
      sx: {
        '& > div': { height: '100%' },
      },
      // label: t('lessons.unit').toString(),
      type: 'custom',
      Component: ({ watch, setValue }) => (
        <Card
          variant="outlined"
          sx={{
            height: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1,
            padding: 1,
          }}
        >
          <Chip disabled={isLoading} label={`${t('lessons.unit')}:`} />
          {watch('_unit') ? (
            <Chip
              disabled={isLoading}
              variant="outlined"
              label={watch('_unit')?.title}
              onDelete={() => setValue('_unit', undefined)}
            />
          ) : (
            <IconButton
              disabled={isLoading}
              size="small"
              onClick={() => setValue('_courseId', courseId)}
            >
              <Add />
            </IconButton>
          )}
        </Card>
      ),
      defaultValue: editItem?.gradeSubjectUnit || null,
    },
    {
      name: 'points',
      defaultValue: editItem?.points || 0,
      type: 'number',
      min: 0,
      label: t('courses.points'),
      disabled: isFreeLesson,
      md: 3,
      order: 1,
    },
    {
      name: 'order',
      defaultValue: editItem?.order || 1,
      type: 'number',
      min: 1,
      label: t('lessons.order'),
      required: true,
      md: 3,
      order: 1,
    },
    {
      name: 'free',
      defaultValue: !!editItem?.free || false,
      label: t('lessons.free').toString(),
      type: 'boolean',
      order: 1,
      md: 4,
      onChange: (v) => setIsFreeLesson(v),
    },
    {
      name: 'files',
      type: 'videos',
      defaultValue: editItem?.fileUrl.length
        ? [convertPhotoUrlToFileUploaderFile(editItem?.fileUrl || '')]
        : [],
      label: t('lessons.mediaFiles'),
      required: true,
      md: 12,
      order: 3,
      limitFileSize: false,
    },
  ];

  const { GenericForm, setValue: setFormValue } =
    useGenericForm<ILessonPayloadForm>({
      inputs: commonInputs,
      onSubmit,
      progressPercent: progress,
      onAbortClick,
      beforeEnd: ({ watch, setValue }) => (
        <>
          <FileUploader
            files={
              defaultThumbnail
                ? [convertPhotoUrlToFileUploaderFile(defaultThumbnail || '')]
                : thumbnail
                ? thumbnail
                : []
            }
            onFilesChange={setThumbnail}
            onDeleteFile={() => setDefaultThumbnail('')}
            withoutSeoFields
            limitFileSize={false}
            label={t('lessons.thumbnail').toString()}
            fileTypes="images"
            required
          />
          <Goals goals={goals} setGoals={setGoals} />
          <UnitPickerDialog
            courseId={watch('_courseId')}
            onClose={(unit) => {
              setValue('_courseId', undefined);
              setValue('_unit', unit);
            }}
          />
        </>
      ),
    });

  useEffect(() => {
    const unit =
      editItem?.gradeSubjectUnit ?? editItem?.collegeSubjectUnit ?? undefined;
    const [courseUnit] = mapUnitsToCourseUnits(unit ? [unit] : []);
    setFormValue('_unit', courseUnit);
  }, [units, editItem, setFormValue]);

  return GenericForm;
}

export default LessonForm;
