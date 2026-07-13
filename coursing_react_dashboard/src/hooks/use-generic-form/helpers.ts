/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-globals */
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { maxMessage, minMessage, requiredMessage } from './constants';
import { TAutoComplete, TInput } from './types';

export const makeYupFromValue = (input: TInput<any>) => {
  let yupItem: any;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();

  switch (input.type) {
    case 'text': {
      if (input.max && input.min) {
        yupItem = Yup.string()
          .max(input.max, maxMessage(input.max))
          .min(input.min, minMessage(input.min))
          .nullable();
      } else if (input.min) {
        yupItem = Yup.string().min(input.min, minMessage(input.min)).nullable();
      } else if (input.max) {
        yupItem = Yup.string().max(input.max, minMessage(input.max)).nullable();
      } else {
        yupItem = Yup.string().nullable();
      }
      break;
    }
    case 'date': {
      yupItem = Yup.string().nullable();
      break;
    }

    case 'number': {
      if (input.max !== undefined && input.min !== undefined) {
        yupItem = Yup.number()
          .max(input.max, maxMessage(input.max))
          .min(input.min, minMessage(input.min));
        // .moreThan(Yup.ref('minMax'), 'Max should be > min');
      } else if (input.min !== undefined) {
        yupItem = Yup.number()
          .min(input.min, minMessage(input.min))
          .transform((value) =>
            value === '' || isNaN(value) ? undefined : value,
          );
      } else if (input.max !== undefined) {
        yupItem = Yup.number()
          .max(input.max, maxMessage(input.max))
          .transform((value) =>
            value === '' || isNaN(value) ? undefined : value,
          );
      } else {
        yupItem = Yup.number().transform((value) =>
          value === '' || isNaN(value) ? undefined : value,
        );
      }
      if (input.moreThan !== undefined) {
        yupItem = yupItem.moreThan(
          Yup.ref(input.moreThan),
          'Max should be > Min',
        );
      }
      break;
    }

    case 'select': {
      if (input.isMulti) {
        yupItem = input.required
          ? Yup.array()
              .of(
                Yup.object().shape({
                  id: Yup.number(),
                  name: Yup.string(),
                }),
              )
              .min(1, String(t(requiredMessage)))
          : Yup.array().of(
              Yup.object().shape({
                id: Yup.number(),
                name: Yup.string(),
              }),
            );
      } else {
        yupItem = Yup.object()
          .shape({
            id: Yup.number(),
            name: Yup.string(),
          })
          .nullable();
      }
      break;
    }

    case 'nested-select': {
      if (input.required)
        yupItem = Yup.number()
          .transform((value) =>
            value === '' || isNaN(value) ? undefined : value,
          )
          .min(1, String(t(requiredMessage)));
      else
        yupItem = Yup.number().transform((value) =>
          value === '' || isNaN(value) ? undefined : value,
        );
      break;
    }

    case 'field-array': {
      if (input.required) {
        yupItem = Yup.array()
          .of(Yup.object().shape(makeYupObject(input.fields)))
          .min(1, String(t(requiredMessage)));
      } else {
        yupItem = Yup.array().of(
          Yup.object().shape(makeYupObject(input.fields)),
        );
      }
      break;
    }

    case 'boolean': {
      yupItem = Yup.boolean();
      break;
    }

    case 'radio': {
      yupItem = Yup.number();
      break;
    }

    default:
      break;
  }

  if (input.required && yupItem) {
    return yupItem.required(String(t(requiredMessage)));
  }
  return yupItem;
};

export const makeYupObject = (inputs: TInput<any>[]) => {
  const objectSchema: Yup.ObjectShape = {};
  const formInputs = inputs.filter(
    ({ name, type }) => name !== 'files' && type !== 'custom',
  );

  formInputs
    .map((input) => ({
      yup: makeYupFromValue(input),
      name: input.name,
    }))
    .forEach((input) => {
      objectSchema[input.name] = input.yup;
    });
  return objectSchema;
};

export const makeDefaultValuesObject = (formInputs: TInput<any>[]) => {
  const obj: any = {};
  formInputs.forEach((input) => {
    obj[input.name] = input.defaultValue;
  });
  return obj;
};

export const getNameById = (options: TAutoComplete[], id: string) =>
  options.find((o) => o.id === Number(id))?.name || '';

export const getFieldArrayInitialValue = (inputs: TInput<any>[]) => {
  type TFieldValue =
    | string
    | Date
    | number
    | TAutoComplete[]
    | TAutoComplete
    | boolean;
  const initialValue: { [key: string]: TFieldValue } = {};
  inputs.forEach((input) => {
    let val: TFieldValue;
    switch (input.type) {
      case 'text': {
        val = '';
        break;
      }
      case 'date': {
        val = new Date();
        break;
      }
      case 'number': {
        val = 0;
        break;
      }
      case 'select': {
        val = input.isMulti
          ? [
              {
                id: 0,
                name: '',
              },
            ]
          : {
              id: 0,
              name: '',
            };
        break;
      }
      case 'nested-select': {
        val = 0;
        break;
      }
      case 'boolean': {
        val = false;
        break;
      }
      case 'radio': {
        val = 0;
        break;
      }
      default: {
        val = '';
        break;
      }
    }
    initialValue[input.name.toString()] = val;
  });
  return initialValue;
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
