import { IFileUploaderFile } from '@craft-code/file-uploader';

export interface IAttachments {
  id?: number;
  title?: string;
  fileUrl?: string;
  courseId?: number | null;
  collegeDetailsSubjectId?: number | null;
  schoolSubjectId?: number | null;
  specializedId?: number | null;
  gradeSubjectId?: number | null;
  order?: number;
}

export interface IAttachmentsPayload {
  id?: number;
  title: string;
  courseId: number | null;
  collegeDetailsSubjectId?: number | null;
  gradeSubjectId?: number | null;
  specializedId?: number | null;
}

export interface IAttachmentsPayloadForm {
  id: number;
  title: string;
  files: IFileUploaderFile[];
  courseId: number;
  _count?: number;
}
export interface IAvatarFiles {
  id: number;
  title: string;
  fileUrl: string[];
}
