/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { TInput } from 'hooks/use-generic-form/types';
import { getFieldArrayInitialValue } from 'hooks/use-generic-form/helpers';
import GenericActionButton from 'components/common/action-cell-buttons/component/generic-action-button.component';
import { ActionType } from 'constants/constants';
import GetFormInputComponent from '../get-form-input/get-form-input.component';

type Properties = {
  name: string;
  inputs: TInput<any>[];
  label?: string;
  errorMessage?: string;
  control: Control<any, any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  hidden?: boolean;
};

function GenericFieldArray({
  name,
  inputs = [],
  label,
  errorMessage,
  control,
  errors,
  setValue,
  hidden,

  watch,
}: Properties) {
  const { fields, remove, append } = useFieldArray({
    control,
    name,
  });

  const initialValue = getFieldArrayInitialValue(inputs);

  return (
    <Box hidden={hidden}>
      {label && (
        <Typography color="#000c" variant="body2" mb={2}>
          {' '}
          {label}{' '}
        </Typography>
      )}
      <Box display="flex" flexDirection="column" width="100%" gap={1}>
        {fields.map((item, index) => (
          <Box key={item.id} display="flex" gap={1} width="100%">
            {Object.entries(item)
              .filter(([key]) => key !== 'id')
              .map(([key], i) => (
                <GetFormInputComponent
                  key={item.id + key}
                  input={inputs[i]}
                  name={`${name}[${index}].${inputs[i].name}`}
                  errors={errors}
                  setValue={setValue}
                  control={control}
                  watch={watch}
                />
              ))}
            <Box maxWidth="20px">
              <GenericActionButton
                actionType={ActionType.DELETE}
                onClickActionButton={() => remove(index)}
                tooltip="delete this field"
              />
            </Box>
          </Box>
        ))}
      </Box>
      <GenericActionButton
        actionType={ActionType.ADD}
        onClickActionButton={() => {
          append(initialValue);
        }}
        tooltip="add another field"
      />
      <Typography variant="caption" color="error" ml={1} mt={1}>
        {errorMessage && errorMessage}
      </Typography>
    </Box>
  );
}

export default GenericFieldArray;
