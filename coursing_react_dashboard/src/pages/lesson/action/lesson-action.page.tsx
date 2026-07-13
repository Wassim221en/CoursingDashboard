import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import lessonApi from 'apis/lesson/lesson.api';
import {
  ILessonPayload,
  ILessonPayloadForm,
} from 'apis/lesson/lesson.interfaces';
import lessonQueries from 'apis/lesson/lesson.queries';
import PageTitle from 'components/common/generic-table-page/components/page-title/page-title.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import prepareLessonFormData from 'components/forms/lesson/helper/prepare-lesson-form-data';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { showSuccess } from 'libs/react.toastify';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import LessonForm from 'components/forms/lesson/lesson.form';
import { IFileUploaderFile } from '@craft-code/file-uploader';
import { useTranslation } from 'react-i18next';
import nanoMetadata from 'nano-metadata';
import { TEditGoal } from './types';

function LessonsActionPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const lessonId = useSearchParams('lesson');
  const courseId = useSearchParams('course');

  const {
    data: lessonDetails,
    isLoading,
    refetch,
  } = lessonQueries.useLessonsDetailsQuery(lessonId || 0);

  const isLoadingLessonDetails = isLoading && !!lessonId;

  const [goals, setGoals] = useState<TEditGoal[]>([]);

  const [thumbnail, setThumbnail] = useState<IFileUploaderFile[]>(
    [] as IFileUploaderFile[],
  );

  useEffect(() => {
    if (lessonDetails?.goals.length)
      setGoals(
        lessonDetails?.goals.map((goal) => ({
          id: `${goal.title} ${Math.random() * Date.now()}`,
          ...goal,
        })),
      );
  }, [lessonDetails?.goals]);

  const abortHandler = useRef<any>();

  const handleLessonsActions = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    {
      data: { _unit, _courseId, ...data },
      files,
      urlsForRemove,
    }: TSubmitHandlerData<ILessonPayloadForm>,
  ) => {
    try {
      const formPayload: ILessonPayload = {
        ...data,
        collegeSubjectUnitId: _unit?.type === 'collage' ? _unit.id : null,
        gradeSubjectUnitId: _unit?.type === 'school' ? _unit.id : null,
        schoolSubjectUnitId: _unit?.type === 'school' ? _unit.id : null,
        goals: goals.map((goal) => ({
          title: goal.title,
        })),
        courseId: courseId || null,
        // videoDuration: '0',
      };

      if (lessonId) {
        const videoDuration = files[0]?.fileObject
          ? ((await nanoMetadata.video.duration(
              files[0]?.fileObject,
            )) as number)
          : 0;
        const payload = {
          ...formPayload,
          videoDuration: lessonDetails?.videoDuration
            ? lessonDetails?.videoDuration
            : `${Math.round(videoDuration)}`,
          id: lessonId,
        };
        const formData = prepareLessonFormData({
          data: payload,
          files,
          thumbnail,
          urlsForRemove,
        });
        await lessonApi.updateLesson(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const videoDuration = (await nanoMetadata.video.duration(
          files[0]?.fileObject,
        )) as number;
        const formData = prepareLessonFormData({
          data: {
            ...formPayload,
            videoDuration: `${Math.round(videoDuration)}`,
          },
          files,
          thumbnail,
          urlsForRemove,
        });
        await lessonApi.addLesson(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });

        showSuccess(t('common.dataAddedSuccessfully'));
      }
      queryClient.invalidateQueries(['get-lessons']);
      refetch();
      navigate(`${pathname.replace('/action', '')}?course=${courseId}`);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const [progress, setProgress] = useState<number>();
  return isLoadingLessonDetails ? (
    <LoadingPlaceholder />
  ) : (
    <div>
      <PageTitle title={lessonDetails?.title || t('lessons.lessonDetails')} />
      <Grid container mt={4} spacing={3}>
        <Grid item xs={12}>
          <LessonForm
            courseId={courseId}
            editItem={lessonDetails!}
            onSubmit={(data) =>
              handleLessonsActions(setProgress, abortHandler, data)
            }
            progress={progress}
            onAbortClick={abortHandler.current}
            goals={goals}
            setGoals={setGoals}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default LessonsActionPage;
