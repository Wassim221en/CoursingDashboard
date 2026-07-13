const ExamApiRoutes = {
  GetAllExams: '/Exam/GetExams',
  GetAllUniversityExams: '/Exam/GetUniversityExams',
  GetAllSchoolExams: '/Exam/GetSchoolExams',
  GetAllSpecializedExams: '/Exam/GetSpecializedExams',
  GetExamById: '/Exam/GetExamById',
  AddExam: '/Exam/AddExam',
  UpdateExam: '/Exam/UpdateExam',
  UpdateExamOrder: '/Exam/UpdateExamOrder',
  RemoveExam: '/Exam/RemoveExam',
  GetAllPastExams: '/Exam/GetPastExams',
  GetPastExamById: '/Exam/GetPastExamById',
  AddPastExam: '/Exam/AddPastExam',
  UpdatePastExam: '/Exam/UpdatePastExam',
  RemovePastExam: '/Exam/RemovePastExam',
  GetQuestionById: '/Exam/GetQuestion',
  GetUserExams: '/Exam/GetUserExams',
  GetStudentsOrderInExam: '/Student/GetStudentOrderInExam',
  AddQuestion: '/Exam/AddQuestion',
  UpdateQuestion: '/Exam/UpdateQuestion',
  RemoveQuestion: '/Exam/RemoveQuestion',
  AddExamQuestion: 'Question/AddExamQuestion',
  RemoveExamQuestion: 'Question/RemoveExamQuestion',
  UpdateExamQuestion: 'Question/UpdateExamQuestion',
  // All Questions Route
  GetAllQuestions: '/Question/GetAllQuestions',
};

export default ExamApiRoutes;
