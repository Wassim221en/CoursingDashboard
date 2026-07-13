/* eslint-disable no-nested-ternary */
import { IAds, IAdsPayloadForm } from 'apis/ads/ads.interfaces';
import { ICollege } from 'apis/college/college.interfaces';
import { IResponse } from 'apis/global-interfaces/global-interfaces';
import { IGrade } from 'apis/grade/grade.interfaces';
import { ISpecialized } from 'apis/specialized/specialized.interfaces';
import { AdsType, AdsTypeEnum, Years } from 'constants/constants';
import { getNameById } from 'hooks/use-generic-form/helpers';
import useGenericForm, {
  TSubmitHandler,
} from 'hooks/use-generic-form/use-generic-form';
import { makeNestedItemsFromSpecialized } from 'pages/specialized/specialized.page';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { convertPhotoUrlToFileUploaderFile } from 'utils/helpers';

type Props = {
  onSubmit: TSubmitHandler<IAdsPayloadForm>;
  editItem: IAds | null;
  colleges: IResponse<ICollege[]> | undefined;
  isLoadingCollege: boolean;
  grades: IResponse<IGrade[]> | undefined;
  isLoadingGrades: boolean;
  specialized: IResponse<ISpecialized[]> | undefined;
  isLoadingSpecialized: boolean;
  progress: number | undefined;
  onAbortClick?: () => void;
};

function AdsForm({
  onSubmit,
  editItem,
  colleges,
  grades,
  isLoadingCollege,
  isLoadingGrades,
  isLoadingSpecialized,
  specialized,
  progress,
  onAbortClick,
}: Props) {
  const { t } = useTranslation();

  const collegeIdFromEdit =
    editItem?.collegeId || editItem?.collegeYearsAds.collegeId || 0;

  const [adType, setType] = useState(
    editItem?.type
      ? editItem?.type
      : collegeIdFromEdit
        ? AdsTypeEnum.College
        : editItem?.gradeId
          ? AdsTypeEnum.Class
          : editItem?.specializedId
            ? AdsTypeEnum.Category
            : 0,
  );

  const [collegeId, setCollegeId] = useState(collegeIdFromEdit ?? 0);

  const { GenericForm, setValue } = useGenericForm<IAdsPayloadForm>({
    inputs: [
      {
        name: 'type',
        defaultValue: adType
          ? {
            id: adType,
            name: getNameById(
              AdsType.map((a) => ({
                id: a.id,
                name: t(`ads-form.${a.name}`),
              })),
              String(adType),
            ),
          }
          : null,
        label: t('ads-form.type'),
        type: 'select',
        required: true,
        md: 12,
        options:
          AdsType.map((a) => ({ id: a.id, name: t(`ads-form.${a.name}`) })) ??
          [],
        onChange: (val) => setType(val?.id || 0),
      },
      {
        name: 'collegeId',
        defaultValue: collegeIdFromEdit
          ? {
            id: collegeIdFromEdit,
            name: getNameById(
              colleges?.data || [],
              String(collegeIdFromEdit),
            ),
          }
          : null,
        label: t('yearlyProjects.college'),
        type: 'select',
        options:
          colleges?.data?.map((grade) => ({
            id: grade.id,
            name: grade.name,
          })) || [],
        md: 12,
        isLoading: isLoadingCollege,
        hidden: !(adType === AdsTypeEnum.College),
        onChange: (val) => setCollegeId(val?.id || 0),
      },
      {
        name: 'collegeYear',
        defaultValue: null,
        label: t('college-details-form.year'),
        type: 'select',
        md: 12,
        options: Years.map((y) => ({
          id: y.id,
          name: t(y.name),
        })),
        hidden: !(adType === AdsTypeEnum.College),
        disabled: !collegeId,
      },
      {
        name: 'gradeId',
        defaultValue: editItem?.gradeId
          ? {
            id: editItem?.gradeId,
            name: getNameById(grades?.data || [], String(editItem?.gradeId)),
          }
          : null,
        label: t('grades.grade'),
        md: 12,
        type: 'select',
        options:
          grades?.data?.map((grade) => ({
            id: grade?.id,
            name: grade?.name,
          })) || [],
        isLoading: isLoadingGrades,
        hidden: !(adType === AdsTypeEnum.Class),
      },
      // {
      //   name: 'specializedId',
      //   defaultValue: editItem?.specializedId ?? 0,
      //   type: 'nested-select',
      //   options:
      //     specialized?.data?.map((special) =>
      //       makeNestedItemsFromSpecialized(special),
      //     ) || [],
      //   md: 12,
      //   isLoading: isLoadingSpecialized,
      //   hidden: !(adType === AdsTypeEnum.Category),
      // },
      {
        name: 'name',
        defaultValue: editItem?.name || '',
        label: t('ads-form.name'),
        type: 'text',
        required: false,
        md: 12,
      },
      {
        name: 'description',
        defaultValue: editItem?.description || '',
        label: t('ads-form.description'),
        type: 'text',
        required: false,
        isMultiLine: true,
        md: 12,
      },
      {
        name: 'files',
        defaultValue: editItem?.coverImageUrl
          ? [convertPhotoUrlToFileUploaderFile(editItem?.coverImageUrl)]
          : [],
        label: t('common.image'),
        type: 'images',
        required: true,
        limitFileSize: false,
        md: 12,
      },
    ],
    onSubmit: (data) => onSubmit(data),
    progressPercent: progress,
    onAbortClick,
  });

  useEffect(() => {
    if (adType === AdsTypeEnum.All) {
      setValue('collegeId', null);
      setValue('collegeYear', null);
      setValue('specializedId', null);
      setValue('gradeId', null);
    } else if (adType === AdsTypeEnum.Category) {
      setValue('collegeId', null);
      setValue('collegeYear', null);
      setValue('gradeId', null);
    } else if (adType === AdsTypeEnum.Class) {
      setValue('collegeId', null);
      setValue('collegeYear', null);
      setValue('specializedId', null);
    } else if (adType === AdsTypeEnum.College) {
      setValue('specializedId', null);
      setValue('gradeId', null);
    }
  }, [setValue, adType]);

  useEffect(() => {
    if (editItem?.collegeYearsAds.years[0])
      setValue('collegeYear', {
        id: editItem?.collegeYearsAds.years[0],
        name: t(getNameById(Years, String(editItem?.collegeYearsAds.years[0]))),
      });
    else setValue('collegeYear', null);
  }, [collegeId, editItem?.collegeYearsAds.years, setValue, t]);

  return GenericForm;
}

export default AdsForm;
