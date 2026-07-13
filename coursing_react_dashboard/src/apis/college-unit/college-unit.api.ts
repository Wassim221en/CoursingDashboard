import CoursingApiInstance from 'apis/coursing-api.instance';
import { IResponse } from 'apis/global-interfaces/global-interfaces';
import {
  ICollegeUnit,
  IGetCollegeUnitsPayload,
  ICollegeUnitPayload,
} from './college-unit.interfaces';
import UnitApiRoutes from './college-unit.api-routes';

const getAllCollegeUnits = async (payload?: IGetCollegeUnitsPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<ICollegeUnit[]>>(
    UnitApiRoutes.GetAllCollegeUnits,
    {
      params: { id: payload?.collegeDetailsSubjectId },
    },
  );
  return data;
};

const getCollegeUnitById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ICollegeUnit>(
    UnitApiRoutes.GetCollegeUnitById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const addCollegeUnit = async (payload: ICollegeUnitPayload) => {
  const { data } = await CoursingApiInstance.post(
    UnitApiRoutes.AddCollegeUnit,
    payload,
  );
  return data;
};

const updateCollegeUnit = async (payload: ICollegeUnitPayload) => {
  const { data } = await CoursingApiInstance.put(
    UnitApiRoutes.UpdateCollegeUnit,
    payload,
  );
  return data;
};

const removeCollegeUnit = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    UnitApiRoutes.RemoveCollegeUnit,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const collegeUnitApi = {
  getAllCollegeUnits,
  getCollegeUnitById,
  addCollegeUnit,
  updateCollegeUnit,
  removeCollegeUnit,
};

export default collegeUnitApi;
