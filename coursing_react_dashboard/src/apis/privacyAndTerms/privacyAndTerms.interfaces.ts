import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IPrivacyAndTerms {
  id: number;
  key: number;
  value: 'string';
}

export interface IPrivacyAndTermsPayload {
  key: number;
  value: 'string';
}

export interface IPrivacyAndTermsPayloadForm {
  id?: number;
  key: TAutoComplete;
  value: 'string';
}
