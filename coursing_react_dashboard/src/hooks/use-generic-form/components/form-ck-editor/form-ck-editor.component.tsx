/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import { Path } from 'react-hook-form/dist/types';
import CkEditor from '../ck-editor/ck-editor.componet';

type IFormCkEditorProps<T extends FieldValues> = {
  control: Control<T, any>;
  name: Path<T>;
  placeholder?: string;
  height?: string;
  required?: boolean;
  tooltipText?: string;
  onValChange?: (val: string) => void;
  [key: string]: any;
};

function FormCkEditor<T extends FieldValues>({
  name,
  placeholder = '',
  control,
  height,
  required = false,
  tooltipText,
  onValChange,
  ...rest
}: IFormCkEditorProps<T>) {
  const [isReady, setIsReady] = useState(false);
  const { field, fieldState } = useController({ control, name });
  const { value, onChange } = field;
  const { error } = fieldState;
  const errorMessage = error?.message;

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;
  return (
    <CkEditor
      tooltipText={tooltipText}
      value={value}
      onChange={(event) => {
        onChange(event);
        onValChange?.(event);
      }}
      placeholder={required ? `${placeholder} *` : placeholder}
      height={height}
      errorMessage={errorMessage}
      {...rest}
    />
  );
}

export default FormCkEditor;
