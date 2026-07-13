import { IFileUploaderFile } from "@craft-code/file-uploader";
import { ICity } from "apis/city/city.interfaces";
import { IUniversityCollege } from "apis/college/college.interfaces";
import { TAutoComplete } from "hooks/use-generic-form/types";

export interface IUniversityPayload {
  id?: number;
  name: string;
  cityIds: number[];
}

export interface IUniversityPayloadForm {
  name: string;
  cityIds: TAutoComplete[];
  files: IFileUploaderFile[];
}

export interface IUniversity {
  id: number;
  name: string;
  fileUrl: string;
}

export interface IUniversityDetails {
  id: number;
  name: string;
  cities: ICity[];
  filesUrls: string[];
  colleges: IUniversityCollege[];
}
