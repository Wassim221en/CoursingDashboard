import React, { ReactNode, useCallback, useState } from 'react';
import LoadingButton from 'hooks/use-generic-form/components/loading-button/loading-button.component';
import {
  FieldValues,
  useForm,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IFileUploaderFile } from '@craft-code/file-uploader';
import * as Yup from 'yup';
import { showError } from 'libs/react.toastify';
import { removeImageServerLink } from 'utils/helpers';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FramerAnimationEnd, FramerAnimationStart } from 'constants/constants';
import { TInput } from './types';
import { makeDefaultValuesObject, makeYupObject } from './helpers';
import GetFormInputComponent from './components/get-form-input/get-form-input.component';

export type TSubmitHandlerData<T> = {
  files: IFileUploaderFile[];
  data: T;
  urlsForRemove: string[];
};

export type TSubmitHandler<T> = (payload: TSubmitHandlerData<T>) => void;

type Properties<T extends FieldValues> = {
  inputs: TInput<T>[];
  onSubmit: TSubmitHandler<T>;
  submitButtonText?: string;
  submitButtonWidth?: string;
  progressPercent?: number;
  onAbortClick?: () => void;
  beforeEnd?:
    | ReactNode
    | (({
        watch,
        setValue,
      }: {
        watch: UseFormWatch<T>;
        setValue: UseFormSetValue<T>;
      }) => ReactNode);
};

function useGenericForm<T extends FieldValues>({
  inputs = [],
  onSubmit,
  submitButtonText,
  submitButtonWidth = '100%',
  progressPercent,
  onAbortClick,
  beforeEnd,
}: Properties<T>) {
  const { t } = useTranslation();
  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<T>({
    defaultValues: makeDefaultValuesObject(inputs),
    resolver: yupResolver(Yup.object().shape(makeYupObject(inputs))),
  });

  const defaultFiles = inputs.find(
    (input) => input.name === 'files',
  )?.defaultValue;

  const [files, setFiles] = useState<IFileUploaderFile[]>(
    defaultFiles as IFileUploaderFile[],
  );

  const [urlsForRemove, setUrlsForRemove] = useState<string[]>([]);

  const handleDeleteFile = useCallback(
    (wantedToDeleteFile: IFileUploaderFile) => {
      if (wantedToDeleteFile.fileObject) return;

      setUrlsForRemove((prev) => {
        if (
          prev.every(
            (file) =>
              file !== removeImageServerLink(wantedToDeleteFile.url ?? ''),
          )
        )
          return [...prev, removeImageServerLink(wantedToDeleteFile.url ?? '')];
        return [...prev];
      });
    },
    [],
  );

  const handleFormSubmit = (data: T) => {
    if (
      inputs.find((input) => input.name === 'files')?.required &&
      !files.length
    )
      return showError('You should choose one image at least');

    delete data.files;

    return onSubmit({
      files,
      data,
      urlsForRemove,
    });
  };

  return {
    reset,
    watch,
    setValue,
    GenericForm: (
      <form
        onSubmit={handleSubmit(handleFormSubmit, (err) =>
          import.meta.env.DEV ? console.warn(err) : undefined,
        )}
      >
        <Grid container spacing={2}>
          {inputs
            .filter((i) => !i.hidden)
            .map((input) => (
              <Grid
                key={input.name}
                item
                sx={input.sx}
                xs={input.xs || 12}
                md={input.md || 4}
                order={input?.order || 'auto'}
              >
                <motion.div
                  animate={FramerAnimationEnd}
                  initial={FramerAnimationStart}
                  transition={{ delay: 0.3 }}
                >
                  <GetFormInputComponent
                    // @ts-ignore
                    input={input}
                    name={input.name}
                    setFiles={setFiles}
                    errors={errors}
                    setValue={setValue}
                    control={control}
                    handleDeleteFile={handleDeleteFile}
                    watch={watch}
                    files={files}
                  />
                </motion.div>
              </Grid>
            ))}
          {beforeEnd && (
            <Grid xs={12} item order={100000000000}>
              {typeof beforeEnd === 'function'
                ? beforeEnd({ watch, setValue })
                : beforeEnd}
            </Grid>
          )}
          <Grid xs={12} item order={100000000000}>
            <LoadingButton
              isSubmitting={isSubmitting}
              disabled={isSubmitting}
              text={submitButtonText || t('common.submit') || 'Submit'}
              width={submitButtonWidth}
              progressPercent={progressPercent}
              onAbortClick={onAbortClick}
            />
          </Grid>
        </Grid>
      </form>
    ),
  };
}

export default useGenericForm;
