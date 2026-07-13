const CourseApiRoutes = {
  GET_ALL: '/Course/GetAll',
  GET_BY_STUDENT_INTEREST: '/Course/GetCoursesByStudentIntersets',
  GET_BY_INSTRUCTOR: '/Course/GetCoursesByInstructor',
  GET_BY_ID: '/Course/GetById',

  ADD_COURSE: '/Course/Add',
  UPDATE_COURSE: '/Course/Update',
  REMOVE_COURSE: '/Course/Remove',

  ENROLL: '/Course/EnrolleCourse',
  UNENROLL: '/Course/UnEnrolleCourse',

  SET_RATING: '/Course/RatingCourse',
  CLEAR_RATING: '/Course/UnRatingCourse',

  GET_COURSE_STUDENT: '/Course/GetCourseStudents',

  GET_MOST_POPULAR: '/Course/GetMostWantedCourses',

  GetAllQA: '/QA/GetAllQA',
  UpdateQA: '/QA/UpdateQuestion',
  ADDQA: '/QA/AddQuestion',
  GetQA: '/QA/GetQA',
  AddAnswer: '/QA/AddAnswer',

  UpdateAnswer: '/QA/UpdateAnswer',
  UpdateQuestionState: '/QA/UpdateFQuestionStatus',
  UpdateQuestionOrder: '/QA/UpdateQAOrder',

  Remove_Question: '/QA/RemoveQuestion',

  REMOVE_ANSWER: '/QA/RemoveAnswer',

  GET_STDUENTS_ORDER_IN_COURSE: 'Student/GetStudentOrderInCourse',

  GET_COURSE_RATING: '/Course/GetCourseRatings',
  GET_INSTRUCTOR_COURSE_RATINGS: '/Course/GetInstructorCourseRatings',

  UPDATE_COURSE_PUBLISH_STATE: '/Course/UpdatePublishCourse',

  MARK_ALL_COURSE_QUESTIONS_AS_READ: '/QA/ReadQuestionFromDashboard',
};
export default CourseApiRoutes;
