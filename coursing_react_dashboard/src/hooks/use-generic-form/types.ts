import { IFileUploaderFile } from '@craft-code/file-uploader';
import { SxProps } from '@mui/system';
import { ExoticComponent, FC } from 'react';
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

export type TFileName = 'videos' | 'files' | 'images' | 'all';

export type TAutoComplete<T = {}> = {
  id: number;
  name: string;
  data?: T;
};

export type TNestedItem = {
  id: number;
  name: string;
  parentId: number | null;
  children: TNestedItem[];
};

export type TRadioOption = {
  label: string;
  value: number;
};

type CustomInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
};

export type TInput<T extends FieldValues> = {
  name: Path<T>;
  required?: boolean;
  sx?: SxProps;
  xs?: number;
  isMulti?: boolean;
  md?: number;
  order?: number;
  hidden?: boolean;
  isLoading?: boolean;
} & (
  | {
      type: 'text';
      defaultValue: string;
      isPassword?: boolean;
      isMultiLine?: boolean;
      label: string;
      disabled?: boolean;
      html?: boolean;
      min?: number;
      max?: number;
      isDuration?: boolean;
      onChange?: (text: string) => void;
    }
  | {
      type: 'date';
      defaultValue: string | null;
      minDate?: Date;
      maxDate?: Date;
      isTime?: boolean;
      isDuration?: boolean;
      isDateAndTime?: boolean;
      label: string;
      disabled?: boolean;
      inputFormat?: string;
      ampm?: boolean;
    }
  | {
      type: 'number';
      defaultValue: number;
      min?: number;
      max?: number;
      moreThan?: string;
      label: string;
      disabled?: boolean;
      onChange?: (number: string) => void;
    }
  | {
      type: 'select';
      defaultValue: TAutoComplete | TAutoComplete[] | null;
      options: TAutoComplete[];
      label: string;
      disabled?: boolean;
      handleAddClick?: () => void;
      freeSolo?: boolean;
      hidden?: boolean;
      onChange?: (val: TAutoComplete | null) => void;
    }
  | {
      type: 'nested-select';
      defaultValue: number;
      options: TNestedItem[];
      isLoading: boolean;
      label?: string;
      disabled?: boolean;
      onChange?: (val: number | null) => void;
    }
  | {
      type: 'boolean';
      defaultValue: boolean;
      label?: string;
      checked?: boolean;
      labelPlacement?: 'start' | 'end' | 'bottom' | 'top';
      onChange?: (bool: boolean) => void;
    }
  | {
      type: 'radio';
      defaultValue: number;
      label?: string;
      options: TRadioOption[];
      onChange?: (rad: number) => void;
    }
  | {
      type: 'field-array';
      defaultValue: any;
      label?: string;
      fields: TInput<any>[];
    }
  | {
      type: TFileName;
      defaultValue: IFileUploaderFile[];
      cropRatio?: number;
      label: string;
      limitFileSize?: boolean;
    }
  | {
      type: 'custom';
      Component: FC<CustomInputProps<T>>;
      defaultValue?: unknown;
    }
);
