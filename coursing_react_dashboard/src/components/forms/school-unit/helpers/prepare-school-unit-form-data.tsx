import { ISchoolUnitPayload } from "apis/school-unit/school-unit.interfaces";

const prepareSchoolUnitFormData = ({ data }: { data: ISchoolUnitPayload }) => {
  const formData = new FormData();

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareSchoolUnitFormData;
