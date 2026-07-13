import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import courseApi from 'apis/course/course.api';
import {
  ICoursePayload,
  ICoursePayloadForm,
} from 'apis/course/course.interfaces';
import courseQueries from 'apis/course/course.queries';
import PageTitle from 'components/common/generic-table-page/components/page-title/page-title.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import CourseForm from 'components/forms/courses/courses.form';
import prepareCourseFormData from 'components/forms/courses/helpers/prepare-course-form-data';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { showSuccess } from 'libs/react.toastify';
import React, { MutableRefObject, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import routesNames from 'routes/constants';

function CoursesActionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const courseId = useSearchParams('course');

  const { data: courseDetails, isLoading } = courseQueries.useCourseByIdQuery(
    courseId || null,
  );

  const isLoadingCourseDetails = isLoading && !!courseId;

  const { pathname = '' } = useLocation();

  function redirectToDedatils(AddedCourseId: number) {
    if (
      pathname.includes(routesNames.universityCourses) ||
      pathname.includes(routesNames.collegeSubjectsDetails)
    )
      navigate(`/universityCourseDetails?course=${AddedCourseId}`);

    if (
      pathname.includes(routesNames.schoolCourses) ||
      pathname.includes(routesNames.schoolSubjectsDetails)
    )
      navigate(`/schoolCourseDetails?course=${AddedCourseId}`);

    if (pathname.includes(routesNames.specializedCourses))
      navigate(`/specializeCourseDetails?course=${AddedCourseId}`);
  }

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

  const handleCoursesActions = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    { data, files }: TSubmitHandlerData<ICoursePayloadForm>,
  ) => {
    const formPayload: ICoursePayload = {
      ...data,
      instructorsIds:
        data.instructorsIds.map((instructors) => instructors.id) || [],
      gradeId: data.gradeId?.id || null,
      gradeSubjectId: data.gradeSubjectId?.id || null,
      collegeDetailsSubjectId: data.collegeDetailsSubjectId?.id || null,
      specializedId: data.specializedId || null,
      collegeId: null,
    };

    try {
      if (courseId) {
        const payload = { ...formPayload, id: courseId };
        const formData = prepareCourseFormData({
          data: payload,
          files,
        });
        await courseApi.updateCourse(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await queryClient.invalidateQueries(['get-courses']);
        showSuccess(t('common.dataUpdatedSuccessfully'));
        navigate(-1);
      } else {
        const formData = prepareCourseFormData({
          data: formPayload,
          files,
        });
        const AddCourse = await courseApi.addCourse(
          formData,
          onProgress,
          (handler) => {
            abortHandlerRef.current = handler;
          },
        );
        await queryClient.invalidateQueries(['get-courses']);
        showSuccess(t('common.dataAddedSuccessfully'));
        const AddedCourseId = AddCourse.id;
        redirectToDedatils(AddedCourseId);
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return isLoadingCourseDetails ? (
    <LoadingPlaceholder />
  ) : (
    <>
      <PageTitle title={courseDetails?.title || t('courses.courseDetails')} />
      <Box mt={4}>
        <CourseForm
          progress={progress}
          editItem={courseDetails!}
          onAbortClick={abortHandler.current}
          onSubmit={(data) =>
            handleCoursesActions(setProgress, abortHandler, data)
          }
        />
      </Box>
    </>
  );
}

export default CoursesActionPage;
