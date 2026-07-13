import { ICity } from 'apis/city/city.interfaces';
import { ICollegeDetails } from 'apis/college-details/college-details.interfaces';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import { ICollege } from 'apis/college/college.interfaces';
import { IGrade } from 'apis/grade/grade.interfaces';
import { ISpecialized } from 'apis/specialized/specialized.interfaces';
import { IUniversity } from 'apis/university/university.interfaces';

interface ISubjectStudents {
  collegeDetailsSubject: ICollegeSubject;
  studentsCount: number;
}

interface ICollegeStudents {
  college: ICollege;
  studentsCount: number;
  subjectStudents: ISubjectStudents[];
}

interface IUniversityStudents {
  university: IUniversity;
  studentsCount: number;
  collegeStudents: ICollegeStudents[];
}

interface ISchoolStudents {
  grade: IGrade;
  studentsCount: number;
}

interface ISpecialityStudents {
  speciality: ISpecialized;
  studentsCount: number;
}

interface ICityStudentStatistics {
  city: ICity;
  studentCount: number;
}

export interface IStatistics {
  studentsCount: number;
  collegeStudentsCount: number;
  schoolStudentsCount: number;
  specialityStudentsCount: number;
  maleStudentCount: number;
  femaleStudentCount: number;
  universityStudents: IUniversityStudents[];
  schoolStudents: ISchoolStudents[];
  specialityStudents: ISpecialityStudents[];
  cityStudentStatistics: ICityStudentStatistics[];
}
