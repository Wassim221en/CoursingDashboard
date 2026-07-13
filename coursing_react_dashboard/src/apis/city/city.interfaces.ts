import { TAutoComplete } from "hooks/use-generic-form/types";

export interface ICityPayload {
  id?: number;
  name: string;
  countryId: number;
}

export interface ICityPayloadForm {
  id?: number;
  name: string;
  countryId: TAutoComplete;
}

export interface ICity {
  id: number;
  name: string;
  country: TAutoComplete;
}
