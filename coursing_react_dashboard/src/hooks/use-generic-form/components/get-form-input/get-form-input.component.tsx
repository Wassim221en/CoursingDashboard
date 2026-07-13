import FileUploader, { IFileUploaderFile } from '@craft-code/file-uploader';
import { Box } from '@mui/material';
import { TInput } from 'hooks/use-generic-form/types';
import { memo } from 'react';
import {
  Control,
  DeepRequired,
  FieldErrorsImpl,
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import FormCheckbox from '../form-checkbox/form-checkbox.component';
import FormCkEditor from '../form-ck-editor/form-ck-editor.component';
import FormDateInputComponent from '../form-date-input/form-date-input.component';
import GenericFieldArray from '../form-field-array/form-field-array.component';
import FormTextFieldComponent from '../form-text-field/form-text-field.component';
import GenericAutoCompleteComponent from '../generic-auto-complete/generic-auto-complete.component';
import NestedSelectComponent from '../nested-select/nested-select.component';
import FormRadio from '../form-radio-input/form-radio-input.component';

type Properties<T extends FieldValues> = {
  input: TInput<T>;
  name: Path<T>;
  control: Control<any, any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: Partial<FieldErrorsImpl<DeepRequired<T>>>;
  files?: IFileUploaderFile[];
  setFiles?: React.Dispatch<React.SetStateAction<IFileUploaderFile[]>>;
  handleDeleteFile?: (wantedToDeleteFile: IFileUploaderFile) => void;
};

function GetFormInput<T extends FieldValues>({
  input,
  name,
  control,
  errors,
  setValue,
  watch,
  files,
  setFiles,
  handleDeleteFile,
}: Properties<T>) {
  switch (input.type) {
    case 'text': {
      if (input.html)
        return (
          <FormCkEditor
            control={control}
            name={name}
            placeholder={input.label}
            height="200px"
            required={input.required}
            onValChange={input.onChange}
          />
        );
      return (
        <FormTextFieldComponent
          label={input.label}
          control={control}
          name={name}
          multiline={input.isMultiLine}
          type={input.isPassword ? 'password' : 'text'}
          required={input.required}
          disabled={input.disabled}
          isDuration={input.isDuration}
          onValChange={input.onChange}
        />
      );
      break;
    }

    case 'number': {
      return (
        <FormTextFieldComponent
          control={control}
          label={input.label}
          name={name}
          type="number"
          required={input.required}
          disabled={input.disabled}
          hidden={input.hidden}
          onValChange={input.onChange}
        />
      );
      break;
    }

    case 'date': {
      return (
        <FormDateInputComponent
          control={control}
          label={input.label}
          name={name}
          isTime={input.isTime}
          isDuration={input.isDuration}
          isDateAndTime={input.isDateAndTime}
          maxDate={input.maxDate}
          minDate={input.minDate}
          required={input.required}
          disabled={input.disabled}
          inputFormat={input.inputFormat}
          ampm={input.ampm}
        />
      );
      break;
    }

    case 'select': {
      return (
        <GenericAutoCompleteComponent
          label={input.label}
          onChange={(value) => {
            setValue(name, value as any);
            input.onChange?.(value);
          }}
          options={input.options}
          value={watch(name)}
          isLoading={input.isLoading}
          required={input.required}
          errorMessage={errors[name]?.message?.toString()!}
          disabled={input.disabled}
          handleAddClick={input.handleAddClick}
          freeSolo={input.freeSolo}
          multiple={input.isMulti}
          hidden={input.hidden}
        />
      );
      break;
    }

    case 'boolean': {
      return (
        <FormCheckbox
          control={control}
          label={input.label || ''}
          labelPlacement={input.labelPlacement}
          name={name}
          defaultChecked={!!input.defaultValue}
          onValChange={input.onChange}
        />
      );
      break;
    }

    case 'radio': {
      return (
        <FormRadio
          control={control}
          options={input.options}
          label={input.label || ''}
          name={name}
          onValChange={input.onChange}
        />
      );
      break;
    }

    case 'nested-select': {
      return (
        <NestedSelectComponent
          items={input.options}
          isLoading={input.isLoading}
          label={input.label}
          value={watch(name)}
          errorMessage={errors[name]?.message?.toString()!}
          disabled={input.disabled}
          onChange={(value) => {
            setValue(name, value as any);
            input.onChange?.(value);
          }}
        />
      );
      break;
    }

    case 'field-array': {
      return (
        <GenericFieldArray
          name={String(name)}
          inputs={input.fields}
          label={input.label}
          errorMessage={errors[name]?.message?.toString()!}
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
          hidden={input.hidden}
        />
      );
      break;
    }
    case 'custom':
      return (
        <input.Component
          control={control}
          name={input.name}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />
      );

    default: {
      if (setFiles && handleDeleteFile && files) {
        return (
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            limitFileSize={input.limitFileSize ?? true}
            label={input.label}
            multi={input.isMulti}
            fileTypes={input.type}
            onDeleteFile={handleDeleteFile}
            required={input.required}
            cropRatio={input.cropRatio || undefined}
          />
        );
      }
      return <Box>Something went wrong</Box>;
      break;
    }
  }
}

export default memo(GetFormInput);
