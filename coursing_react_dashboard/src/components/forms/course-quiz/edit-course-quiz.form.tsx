import { IQuestion } from "apis/exam/exam.interfaces";
import useGenericForm, { TSubmitHandler } from "hooks/use-generic-form/use-generic-form";

type IProps = {
  onSubmit: TSubmitHandler<IQuestion>;
  editItem: IQuestion | null;
};

function EditCourseQuestiosnForm({ onSubmit, editItem }: IProps) {
  const { GenericForm } = useGenericForm<IQuestion>({
    inputs: [
      {
        name: 'title',
        defaultValue: editItem && editItem.title ? editItem.title : '',
        label: 'title',
        type: 'text',
        xs: 12,
        md: 12,
        required: true,
      },
      {
        name: 'mark',
        defaultValue: editItem && editItem.mark ? editItem.mark : 0,
        label: 'mark',
        type: 'number',
        min: 0,
        max: 100,
        xs: 12,
        md: 12,
      },
      {
        name: 'answerText',
        defaultValue: editItem && editItem.answerText ? editItem.answerText : '',
        label: 'answer',
        type: 'text',
        xs: 12,
        md: 12,
        required: false,
      },
      // {
      //   name: 'chooseType',
      //   type: 'select',
      //   defaultValue: editItem ? editItem.chooseType : null,
      //   options: exams,
      //   label: 'choose type',
      // xs: 12,
      // md: 12,
      // },
      {
        name: 'chooses',
        type: 'field-array',
        defaultValue: editItem && editItem.chooses ? editItem.chooses : [],
        label: 'chooses:',
        xs: 12,
        md: 12,
        fields: [
          {
            name: 'title',
            defaultValue: '',
            label: 'chooses title',
            type: 'text',
            xs: 6,
            order: 1,
            required: false,
          },
          {
            name: 'theTrueAnswer',
            defaultValue: false,
            label: 'is it the true answer',
            type: 'boolean',
            xs: 6,
            order: 1,
            required: false,
          },
        ],
      }
    ],
    onSubmit: (data) => onSubmit(data),
  });

  return GenericForm;
}

export default EditCourseQuestiosnForm;
