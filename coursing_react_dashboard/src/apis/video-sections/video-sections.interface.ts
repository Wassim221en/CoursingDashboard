import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';

export interface ITimeOfBegin {
  houres: number;
  minutes: number;
  seconds: number;
}

export interface IVideoSectionPayloadDetails {
  id: number;
  title: string;
  image: File;
  timeOfBegin: ITimeOfBegin;
  order: number;
}

export interface IVideoSectionPayload {
  videoId: number;
  order?: number;
  videoSectionDetails: IVideoSectionPayloadDetails;
}

export interface IVideoSectionPayloadForm {
  title: string;
  timeBegin: Date;
  order: number;
  files: IFileUploaderFile[];
}

export interface IVideoSection {
  id: number;
  videoId: number;
  title: string;
  timeOfBegin: ITimeOfBegin;
  order: number;
  imageUrl: string;
}

export interface IGetVideoSectionsPayload extends IPaginationParams {
  videoId: number;
}
