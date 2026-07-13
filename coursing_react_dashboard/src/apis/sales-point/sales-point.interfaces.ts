import { TAutoComplete } from 'hooks/use-generic-form/types';
import { ITime } from 'utils/helpers';

export interface ISalesPoint {
  id: number;
  name: string;
  timeOfOpen: ITime;
  timeOfClose: ITime;
  address: string;
  city: string;
  cityId: number;
}

export interface ISalesPointPayload {
  name: string;
  salesPointId?: number;
  timeOfOpen: ITime;
  timeOfClose: ITime;
  address: string;
  city: string;
  cityId: number;
}

export interface ISalesPointPayloadForm {
  name: string;
  salesPointId?: number;
  timeOfOpen: Date;
  timeOfClose: Date;
  address: string;
  city: TAutoComplete;
}

export interface IGetSalesPointPayload {
  cityId?: number;
  pageSize?: number;
  pageNumber?: number;
}

export interface IPointsCodes {
  id: number;
  point: number;
  code: string;
  user: string;
  codeStatus: number;
  expireDate: string;
  canChangeStatus: boolean;
}

export interface IGeneratePointsPayload {
  salesPointId?: number;
  PointNumber: number;
  point: number;
  expiredate: string;
}

export interface IGeneratePointsPayloadForm {
  salesPointId?: number;
  PointNumber: number;
  point: number;
  expiredate: string;
}

export interface IPointsForSalePoint {
  pointsCodes: IPointsCodes;
}

export interface IPointsForSalePointPayload {
  salesPointId: number;
  pageSize: number;
  pageNumber: number;
}

export interface IPointsForSalePointPayloadForm {
  salesPointId: TAutoComplete;
  pageSize: number;
  pageNumber: number;
}

export interface IChangeCodeStatusPayloadForm {
  codeId: number;
  statusCode: TAutoComplete;
}

export interface IChangeCodeStatusPayload {
  codeId: number;
  statusCode: number;
}
