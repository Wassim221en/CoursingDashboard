import React, { FC } from 'react';
import Editor from 'ckeditor5-custom-build';
import 'ckeditor5-custom-build/build/translations/ar';
import { Card, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useTranslation } from 'react-i18next';
// import { SERVER_BASE_URL } from "constants/domain";
import { showError } from 'libs/react.toastify';
import { validateSize } from 'utils/helpers';
import InputTooltip from '../input-tooltip/input-tooltip.component';

interface CkEditorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  errorMessage?: string | undefined;
  tooltipText?: string;
}

const CkEditor: FC<CkEditorProps> = ({
  value,
  onChange,
  placeholder,
  height,
  tooltipText = '',
  errorMessage,
}) => {
  function uploadAdapter(loader: any) {
    return {
      upload: () =>
        new Promise((resolve, reject) => {
          loader.file.then((file: File) => {
            if (!validateSize(file.size, 1)) {
              showError(`Image Size Can't exceed 1 MB in size`);
              reject();
            }
            const formData = new FormData();
            formData.append('file', file);
            //   blogsApi
            //     .uploadImage(formData, {
            //       onUploadProgress: (evt) => {
            //         if (evt.lengthComputable) {
            //           loader.uploadTotal = evt.total;
            //           loader.uploaded = evt.loaded;
            //         }
            //       },
            //     })
            //     .then(({ result }) => {
            //       resolve({ default: `${SERVER_BASE_URL}${result.url}` });
            //     })
            //     .catch((err) => reject(err));
          });
        }),
    };
  }

  function uploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (
      loader: any,
    ) => {
      console.log(loader);

      return uploadAdapter(loader);
    };
  }

  const { i18n } = useTranslation();

  return (
    <Card
      sx={{
        overflow: 'visible',
        position: 'relative',
        boxShadow: 'none',
        '.ck-editor__editable': { minHeight: height || null },
        '.ck.ck-editor__main>.ck-editor__editable ': {
          background: 'white',
        },
        '.ck-progress-bar': {
          height: '10px !important',
        },
      }}
    >
      {tooltipText && (
        <InputTooltip
          title={tooltipText}
          sx={{ position: 'absolute', right: 10, top: 10, zIndex: 10 }}
        />
      )}
      <CKEditor
        key={i18n.language}
        editor={Editor}
        data={value}
        config={{
          placeholder,
          extraPlugins: [uploadPlugin],
          language: i18n.language,
        }}
        onChange={(_: any, editor: any) => {
          onChange(editor.getData());
        }}
      />
      {errorMessage && (
        <Typography sx={{ color: 'red', my: 1, ml: 1 }} variant="caption">
          {errorMessage}
        </Typography>
      )}
    </Card>
  );
};

export default CkEditor;
