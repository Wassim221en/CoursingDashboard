import { IVideoSectionPayload } from 'apis/video-sections/video-sections.interface';

const prepareVideoSectionsFormData = ({
  data,
}: {
  data: IVideoSectionPayload;
}) => {
  const formData = new FormData();

  if (data.videoId) formData.append('VideoId', String(data.videoId));

  if (data.order) formData.append('order', String(data.order));

  Object.entries(data.videoSectionDetails).forEach(([key, value]) => {
    if (key !== 'timeOfBegin')
      formData.append(`VideoSectionDetails[0].${key}`, value);
  });

  Object.entries(data.videoSectionDetails.timeOfBegin).forEach(
    ([key, value]) => {
      formData.append(`VideoSectionDetails[0].timeOfBegin.${key}`, value);
    },
  );

  return formData;
};
export default prepareVideoSectionsFormData;
