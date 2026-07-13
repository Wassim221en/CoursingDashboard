import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IAds {
  id: number;
  name: string;
  description: string;
  coverImageUrl: string;
  type: number | null;
  collegeId: number | null;
  specializedId: number | null;
  gradeId: number | 4;
  collegeYearsAds: {
    collegeId: number;
    years: number[];
  };
}

export interface IAdsPayloadForm {
  id: number;
  name?: string;
  description?: string;
  files: IFileUploaderFile;
  type?: TAutoComplete | null;
  collegeId?: TAutoComplete | null;
  specializedId?: number | null;
  gradeId?: TAutoComplete | null;
  collegeYear?: TAutoComplete | null;
}

export interface IAdsPayload {
  id: number;
  name?: string;
  description?: string;
  type: number | null;
  collegeId?: number | null;
  specializedId?: number | null;
  gradeId?: number | null;
  collegeYear?: number | null;
}

export interface IGetAds extends IPaginationParams {
  type: string | null;
  specializedId: number | null;
  collegeYear: string | null;
  gradeId: number | null;
  collegeId: number | null;
}
