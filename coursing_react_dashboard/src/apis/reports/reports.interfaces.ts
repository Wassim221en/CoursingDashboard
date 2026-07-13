import { IExam, IQuestion } from 'apis/exam/exam.interfaces';
import { IInstructor } from 'apis/instructor/instructor.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { IUser } from 'apis/request-paper/request-paper.interfaces';

type IReportSection = 'University' | 'Schooling' | 'Specialty';

export interface IReportCourse {
  id: number;
  title: string;
  subject?: {
    name?: string;
  } | null;
}

export interface IReport {
  id: number;
  questionReason: number;
  type: string;
  description: string;
  student: IUser;
  exam: IExam;
  lesson: ILesson | null;
  course: IReportCourse | null;
  question: IQuestion;
  instructor: IInstructor;
  date: string;
  subject?: string | null;
  isReadFromDashboard?: boolean;
}

export interface IGetReportsPayload {
  section: string | null;
  type: string | null;
  instructorId?: number | null;
  lessonId?: number | null;
  examId?: number | null;
  courseId?: number | null;
  questionId?: number | null;
}
