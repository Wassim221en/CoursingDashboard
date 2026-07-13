import CoursingApiInstance from 'apis/coursing-api.instance';
import { IResponse } from 'apis/global-interfaces/global-interfaces';
import SalesPointApiRoutes from './sales-point.api-route';
import {
  IGeneratePointsPayload,
  IGetSalesPointPayload,
  IPointsCodes,
  IPointsForSalePoint,
  IPointsForSalePointPayload,
  ISalesPoint,
  ISalesPointPayload,
} from './sales-point.interfaces';

const getAllSalesPoints = async (payload?: IGetSalesPointPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<ISalesPoint[]>>(
    SalesPointApiRoutes.GetAllSalesPoints,
    {
      params: payload,
    },
  );
  return data;
};

const getSalesPointById = async (salesPointId: number) => {
  const { data } = await CoursingApiInstance.get<ISalesPoint>(
    SalesPointApiRoutes.GetSalesPoint,
    {
      params: {
        salesPointId,
      },
    },
  );
  return data;
};

const removeSalesPoint = async (salesPointId: number) => {
  const { data } = await CoursingApiInstance.delete(
    SalesPointApiRoutes.RemoveSalesPoint,
    {
      params: {
        salesPointId,
      },
    },
  );
  return data;
};

const updateSalesPoint = async (payload: ISalesPointPayload) => {
  const { data } = await CoursingApiInstance.put(
    SalesPointApiRoutes.UpdateSalesPoint,
    payload,
  );
  return data;
};

const addSalesPoint = async (payload: ISalesPointPayload) => {
  const { data } = await CoursingApiInstance.post(
    SalesPointApiRoutes.AddSalesPoint,
    payload,
  );
  return data;
};

const generatePoint = async (paylaod: IGeneratePointsPayload) => {
  const { data } = await CoursingApiInstance.post(
    SalesPointApiRoutes.GeneratePoints,
    null,
    {
      params: paylaod,
    },
  );

  return data;
};

const getPointsforSalesPoints = async (payload: IPointsForSalePointPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<IPointsCodes[]>>(
    SalesPointApiRoutes.GetPointsOfSalePoint,
    {
      params: payload,
    },
  );

  return data;
};

const RemovePoints = async (pointCodeId: number) => {
  const { data } = await CoursingApiInstance.delete(
    SalesPointApiRoutes.RemovePoints,
    {
      params: { pointCodeId },
    },
  );
  return data;
};

const changeCodeStatus = async (codeId: number, statusCode: number) => {
  const { data } = await CoursingApiInstance.post(
    SalesPointApiRoutes.ChangeCodeStatus,
    null,
    {
      params: { codeId, statusCode },
    },
  );

  return data;
};

const salesPointtApi = {
  getAllSalesPoints,
  getSalesPointById,
  removeSalesPoint,
  updateSalesPoint,
  addSalesPoint,
  generatePoint,
  getPointsforSalesPoints,
  RemovePoints,
  changeCodeStatus,
};

export default salesPointtApi;
