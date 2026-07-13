import { IStudent } from 'apis/student/student.interfaces';

export interface IStudentReviews {
  id: number;
  comment: string;
  rating: number;
  student: IStudent;
}

export interface IAppRating {
  ratingAvarage: number;
  studentReviews: IStudentReviews[];
}
