import CoursingApiInstance from 'apis/coursing-api.instance';
import { IResponse } from 'apis/global-interfaces/global-interfaces';
import {
  IGetSchoolUnitsPayload,
  IGradesSubjectUnit,
  IGradesSubjectUnitPayload,
  ISchoolUnit,
  ISchoolUnitPayload,
} from './school-unit.interfaces';
import UnitApiRoutes from './school-unit.api-routes';

const getAllSchoolUnits = async (payload?: IGetSchoolUnitsPayload) => {
  const { data } = await CoursingApiInstance.get<IResponse<ISchoolUnit[]>>(
    UnitApiRoutes.GetAllSchoolUnits,
    {
      params: payload,
    },
  );
  return data;
};

const getSchoolUnitById = async (id: number) => {
  const { data } = await CoursingApiInstance.get<ISchoolUnit>(
    UnitApiRoutes.GetSchoolUnitById,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const getGradesSubjectUnit = async (payload: IGradesSubjectUnitPayload) => {
  const { data } = await CoursingApiInstance.get<
    IResponse<IGradesSubjectUnit[]>
  >(UnitApiRoutes.GetGradeSubjectUnits, {
    params: payload,
  });
  return data;
};

const addGradeUnit = async (payload: ISchoolUnitPayload) => {
  const { data } = await CoursingApiInstance.post(
    UnitApiRoutes.AddGradeUnit,
    payload,
  );
  return data;
};

const updateGradeUnit = async (payload: ISchoolUnitPayload) => {
  const { data } = await CoursingApiInstance.put(
    UnitApiRoutes.UpdateGradeUnit,
    payload,
  );
  return data;
};

const removeSchoolUnit = async (id: number) => {
  const { data } = await CoursingApiInstance.delete(
    UnitApiRoutes.RemoveGradelUnit,
    {
      params: {
        id,
      },
    },
  );
  return data;
};

const schoolUnitApi = {
  getAllSchoolUnits,
  getSchoolUnitById,
  addGradeUnit,
  updateGradeUnit,
  removeSchoolUnit,
  getGradesSubjectUnit,
};

export default schoolUnitApi;
