import { helperFunctions } from '@craft-code/react-helper-utils';
import { IFileUploaderFile } from '@craft-code/file-uploader';
import { SERVER_BASE_URL } from 'constants/domain';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import AudioSvg from '../../public/assets/svgs/audio-square-svgrepo-com.svg';
import ExcelSvg from '../../public/assets/svgs/excel2-svgrepo-com.svg';
import UnknownSvg from '../../public/assets/svgs/file-unknown-svgrepo-com.svg';
import CsvSvg from '../../public/assets/svgs/files-csv-collection-svgrepo-com.svg';
import FilesSvg from '../../public/assets/svgs/files-svgrepo-com.svg';
import PdfSvg from '../../public/assets/svgs/pdf-svgrepo-com.svg';
import WordSvg from '../../public/assets/svgs/word-svgrepo-com.svg';
import VideoSvg from '../../public/assets/svgs/video-camera-svgrepo-com.svg';
import PowerpointSvg from '../../public/assets/svgs/powerpoint2-svgrepo-com.svg';

export const getImageServerLink = (imageUrl: string) => {
  if (!imageUrl) return '';
  return `${SERVER_BASE_URL}${imageUrl}`;
};

export const removeImageServerLink = (imageUrl: string) => {
  if (!imageUrl) return '';
  return imageUrl.replace(SERVER_BASE_URL, '');
};

export const fileExtensionToName = (ext: string) => {
  if (!ext) return '';
  ext = ext.toLowerCase();
  if (
    ext.indexOf('jpg') !== -1 ||
    ext.indexOf('png') !== -1 ||
    ext.indexOf('webp') !== -1 ||
    ext.indexOf('jpeg') !== -1
  ) {
    return 'Image_File';
  }
  if (ext.indexOf('mp3') !== -1 || ext.indexOf('wav') !== -1) {
    return 'Audio_File';
  }
  if (
    ext.indexOf('mp4') !== -1 ||
    ext.indexOf('mov') !== -1 ||
    ext.indexOf('avi') !== -1
  ) {
    return 'Video_File';
  }
  if (ext.indexOf('pdf') !== -1) {
    return 'PDF_File';
  }
  if (ext.indexOf('doc') !== -1 || ext.indexOf('docx') !== -1) {
    return 'Word_File';
  }
  if (ext.indexOf('xlsx') !== -1 || ext.indexOf('xlsm') !== -1) {
    return 'Excel_File';
  }
  if (ext.indexOf('csv') !== -1) {
    return 'Csv_File';
  }
  if (
    ext.indexOf('pptx') !== -1 ||
    ext.indexOf('ppt') !== -1 ||
    ext.indexOf('pptm') !== -1
  ) {
    return 'PowerPoint_File';
  }
  if (ext.indexOf('txt') !== -1) {
    return 'Text_File';
  }
  if (
    ext.indexOf('zip') !== -1 ||
    ext.indexOf('rar') !== -1 ||
    ext.indexOf('7zip') !== -1
  ) {
    return 'Compressed_File';
  }

  return 'File';
};

export const getFileExtFromUrl = (url: string) =>
  url.slice(url.lastIndexOf('.'));

export const convertPhotoUrlToFileUploaderFile = (
  photoUrl: string,
): IFileUploaderFile => ({
  id: Date.now() + Math.random(),
  fileObject: null,
  name: photoUrl,
  size: 0,
  type: helperFunctions().fileExtensionToName(getFileExtFromUrl(photoUrl)),
  url: photoUrl,
});

export const isExpiredToken = (expiration: string) =>
  new Date() > new Date(expiration);

export const truncateString = (str: string, wantedLength: number) => {
  if (typeof str !== 'string') return str;
  if (str?.length > wantedLength) {
    return `${str.slice(0, wantedLength)}...`;
  }
  return str;
};

export const validateSize = (size: number, sizeLimitInMb: number) => {
  const fileSize = size / 1024 / 1024; // in MiB
  return sizeLimitInMb > fileSize;
};

export const sanitizeHtml = (html: string, backend: boolean = true) => {
  const noTagHTML = (html || '').replaceAll(
    /<script>.*<\/script>|<[^>]+>|<\/[^>]+>/gm,
    '',
  );
  return backend || typeof window === 'undefined'
    ? noTagHTML.replaceAll(/&[^;]+;/gm, '')
    : new DOMParser().parseFromString(noTagHTML, 'text/html').body.innerText;
};

export const generateFriendlyDate = (date: string) => {
  const objectDate = new Date(date);
  if (Number.isNaN(objectDate.getTime())) return '-';
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  return formatter.format(objectDate);
};

export const generateFriendlyDateAndTime = (date: string) => {
  const objectDate = new Date(date);
  if (Number.isNaN(objectDate.getTime())) return '-';
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const parts = formatter.formatToParts(objectDate);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  const day = getPart('day');
  const month = getPart('month');
  const year = getPart('year');
  const hour = getPart('hour');
  const minute = getPart('minute');
  const dayPeriod = getPart('dayPeriod');
  return `${day}/${month}/${year} | ${hour}:${minute} ${dayPeriod}`.trim();
};

export interface ITime {
  houres: number;
  minutes: number;
  seconds: number;
}

export const getDateFromObject = (time?: ITime): string => {
  if (time && (time.houres || time.minutes || time.seconds)) {
    const d = new Date();
    d.setHours(time.houres);
    d.setMinutes(time.minutes);
    d.setSeconds(time.seconds);
    return d.toString();
  }
  return '';
};

export const getFileType = (fileUrl: string) => {
  const fileType = fileExtensionToName(getFileExtFromUrl(fileUrl));

  let icon = <div />;

  switch (fileType) {
    case 'Audio_File':
      icon = (
        <LazyLoadImage
          src={AudioSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;
    case 'PDF_File':
      icon = (
        <LazyLoadImage
          src={PdfSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;

    case 'Word_File':
      icon = (
        <LazyLoadImage
          src={WordSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;
    case 'PowerPoint_File':
      icon = (
        <LazyLoadImage
          src={PowerpointSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;

    case 'Video_File':
      icon = (
        <LazyLoadImage
          src={VideoSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;

    case 'File':
      icon = (
        <LazyLoadImage
          src={FilesSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;

    case 'Excel_File':
      icon = (
        <LazyLoadImage
          src={ExcelSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;

    case 'Csv_File':
      icon = (
        <LazyLoadImage
          src={CsvSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;

    default:
      icon = (
        <LazyLoadImage
          src={UnknownSvg}
          style={{
            objectFit: 'cover',
            width: 100,
            height: 100,
            borderRadius: 4,
          }}
        />
      );
      break;
  }

  return {
    fileType,
    icon,
  };
};

export const convertUtcDateToLocaleDate = (date: string) => {
  const currentDate = new Date(date);
  if (Number.isNaN(currentDate.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(currentDate);
};

export const getRandomAvatar = ({
  fullName,
  gender = 1,
}: {
  fullName: string;
  gender?: number;
}) => {
  const genderType = gender === 1 ? 'male' : 'female';

  return `https://avatars.dicebear.com/api/human/${genderType}/${encodeURIComponent(
    fullName,
  )}.png`;
};
