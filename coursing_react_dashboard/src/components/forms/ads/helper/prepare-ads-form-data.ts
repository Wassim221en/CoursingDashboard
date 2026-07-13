import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IAdsPayload } from 'apis/ads/ads.interfaces';

const YEARS = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

const prepareAdsFormData = ({
  data,
  files,
}: {
  data: IAdsPayload;
  files: IFileUploaderFile[];
}) => {
  const formData = new FormData();
  if (files) {
    files
      ?.filter((file) => !!file.fileObject)
      .forEach((newFile) => {
        formData.append('coverImageFile', newFile.fileObject!);
      });
  }

  if (data.collegeYear) {
    formData.append('collegeYear', YEARS[data.collegeYear - 1]);
  }

  Object.entries(data)?.forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== 'collegeYear') {
      formData.append(key, String(value));
    }
  });

  return formData;
};
export default prepareAdsFormData;
