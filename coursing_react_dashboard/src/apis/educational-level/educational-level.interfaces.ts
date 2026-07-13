import { TAutoComplete } from "hooks/use-generic-form/types";

export interface IEducationalLevel {
  id: number;
  name: string;
}

export interface IEducationalLevelPayloadForm {
  id?: number;
  name: string;
  gradesIds: TAutoComplete[];
}

export interface IEducationalLevelPayload {
  id?: number;
  name: string;
  gradesIds: number[];
}

export interface IEducationalLevelDetails {
  id?: number;
  name: string;
  grades: TAutoComplete[];
}

export interface IGetEducationalLevelPayload {}
