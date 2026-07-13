import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import collegeUnitApi from 'apis/college-unit/college-unit.api';
import schoolUnitApi from 'apis/school-unit/school-unit.api';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import { ISchoolUnit } from 'apis/school-unit/school-unit.interfaces';
import courseApi from './course.api';
import {
  ICourseRatingPayload,
  IGetCourseQuestionPayload,
  IGetCourseStudentPayload,
  IGetCoursesPayload,
  IGetStudentsOrderInCoursePayload,
  TCourseUnit,
} from './course.interfaces';

const isSchoolUnit = (unit: ISchoolUnit | ICollegeUnit): unit is ISchoolUnit =>
  'schoolSubject' in unit || 'gradeSubject' in unit;

export const mapUnitsToCourseUnits = (
  units: (ISchoolUnit | ICollegeUnit)[] = [],
): TCourseUnit[] =>
  units.map((unit) => {
    const { children, ...originalWithoutChildren } = unit;
    return {
      id: unit.id,
      title: unit.title,
      description: unit.description ?? undefined,
      type: isSchoolUnit(unit) ? 'school' : 'collage',
      children: mapUnitsToCourseUnits(unit.children),
      originalWithoutChildren,
    };
  });

const useCourseInfiniteQuery = (
  payload: IGetCoursesPayload & IPaginationParams,
) => {
  const queryResult = useInfiniteQuery(
    ['get-courses', payload],
    async ({ pageParam = 0 }) => {
      const result = await courseApi.getAllCorses({
        ...payload,
        pageNumber: pageParam,
      });
      return {
        data: result,
        pageParam: pageParam + 1,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.data.hasNextPage) return undefined;
        return lastPage.pageParam;
      },
      refetchOnMount: 'always',
    },
  );
  return queryResult;
};

const useCoursesQuery = (
  payload: IGetCoursesPayload & IPaginationParams,
  disabled: boolean = false,
) => {
  const queryResult = useQuery(
    ['get-coursess', payload],
    () => courseApi.getAllCorses(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const useCourseByIdQuery = (id: number | null) => {
  const queryResult = useQuery(
    ['get-course-by-id', id],
    () => courseApi.getCourseDetails(id),
    {
      enabled: !!id,
      cacheTime: 0,
    },
  );
  return queryResult;
};

const useCourseStudents = (
  payload: IPaginationParams & IGetCourseStudentPayload,
) => {
  const queryResult = useQuery(['get-course-students', payload], () =>
    courseApi.getCourseStudnets(payload),
  );
  return queryResult;
};

const useMostPopularCourseQuery = (payload: IPaginationParams) => {
  const queryResult = useQuery(['get-most-popular-course', payload], () =>
    courseApi.getMostPopularCourse(payload),
  );

  return queryResult;
};

const useCourseQuestionsAndAnswersQuery = (
  payload: IPaginationParams & IGetCourseQuestionPayload,
) => {
  const queryResult = useQuery(
    ['get-all-course-questions-and-answers', payload],
    () => courseApi.getCourseQustionsAndAnswers(payload),
  );

  return queryResult;
};

const useStudentsOrderInCourseQuery = (
  payload: IGetStudentsOrderInCoursePayload & IPaginationParams,
) => {
  const queryResult = useQuery(['get-students-order-in-course', payload], () =>
    courseApi.getStudentsOrderInCourse(payload),
  );

  return queryResult;
};

const useCourseRatingQuery = (
  payload: IPaginationParams & ICourseRatingPayload,
) => {
  const queryResult = useQuery(['get-course-rating', payload], () =>
    courseApi.getCourseRating(payload),
  );
  return queryResult;
};

const useInstructorCourseRatingQuery = (
  payload: IPaginationParams & ICourseRatingPayload,
) => {
  const queryResult = useQuery(
    ['get-instructor-course-rating', payload],
    () => courseApi.getInstructorCourseRating(payload),
  );
  return queryResult;
};

// please forgive me if you ever had to debug this shit of a code
const useCourseUnitsQuery = ({ courseId }: { courseId?: number }) =>
  useQuery({
    queryKey: ['get-course-units', courseId],
    queryFn: async (): Promise<TCourseUnit[]> => {
      if (typeof courseId !== 'number') return [];
      try {
        const { gradeSubject, collegeDetailsSubject } =
          await courseApi.getCourseDetails(courseId);
        // if the course is a collage course
        if (
          !!collegeDetailsSubject &&
          typeof collegeDetailsSubject.collegeDetailsSubjectId === 'number'
        ) {
          return mapUnitsToCourseUnits(
            (
              await collegeUnitApi.getAllCollegeUnits({
                collegeDetailsSubjectId:
                  collegeDetailsSubject.collegeDetailsSubjectId,
              })
            ).data,
          );
        }
        // if the course is a school course
        if (!!gradeSubject && typeof gradeSubject.gradeSubjectId === 'number') {
          return mapUnitsToCourseUnits(
            (
              await schoolUnitApi.getGradesSubjectUnit({
                gradeSubjectId: gradeSubject.gradeSubjectId,
              })
            ).data,
          );
        }
      } catch (error) {
        console.error(error);
      }
      return [];
    },
    enabled: typeof courseId === 'number',
  });

const courseQueries = {
  useCoursesQuery,
  useCourseByIdQuery,
  useCourseInfiniteQuery,
  useCourseStudents,
  useMostPopularCourseQuery,
  useCourseQuestionsAndAnswersQuery,
  useStudentsOrderInCourseQuery,
  useCourseRatingQuery,
  useInstructorCourseRatingQuery,
  useCourseUnitsQuery,
};

export default courseQueries;
