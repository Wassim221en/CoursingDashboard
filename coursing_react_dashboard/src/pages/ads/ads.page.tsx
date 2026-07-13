import { IAds, IAdsPayload, IAdsPayloadForm } from 'apis/ads/ads.interfaces';
import adsQueries from 'apis/ads/ads.queries';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import NoData from 'components/common/no-data/no-data.component';
import PageContainer from 'components/common/page-container/page-container.component';
import AdsForm from 'components/forms/ads/ads.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { InfiniteListWrapper } from '@craft-code/react-helper-utils';
import { Box, Grid } from '@mui/material';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import prepareAdsFormData from 'components/forms/ads/helper/prepare-ads-form-data';
import adsApi from 'apis/ads/ads.api';
import { showSuccess } from 'libs/react.toastify';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import {
  AdsType,
  AdsTypeEnum,
  ControllersNames,
  Years,
} from 'constants/constants';
import collegeQueries from 'apis/college/college.queries';
import gradeQueries from 'apis/grade/grade.queries';
import specializedQueries from 'apis/specialized/specialized.queries';
import NestedSelectComponent from 'hooks/use-generic-form/components/nested-select/nested-select.component';
import ProtectPage from 'components/common/protect-page/protectPage';
import { makeNestedItemsFromSpecialized } from 'pages/specialized/specialized.page';
import { getNameById } from 'hooks/use-generic-form/helpers';
import AdsCard from './components/ads-card';

function AdsPage() {
  const { t } = useTranslation();

  const [adsType, setAdsType] = useState<TAutoComplete | null>(null);
  const [specializedId, setSpecializedId] = useState<TAutoComplete | null>(
    null,
  );
  const [gradeId, setGradeId] = useState<TAutoComplete | null>(null);
  const [collegeYear, setCollegeYear] = useState<TAutoComplete | null>(null);
  const [collegeId, setCollegeId] = useState<TAutoComplete | null>(null);

  const { data: colleges, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery();

  const { data: grades, isLoading: isLoadingGrades } =
    gradeQueries.useGradesQuery();

  const { data: specialized, isLoading: isLoadingSpecialized } =
    specializedQueries.useSpecializedQuery();

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

  useEffect(() => {
    if (adsType?.id === AdsTypeEnum.All) {
      setCollegeId(null);
      setCollegeYear(null);
      setSpecializedId(null);
      setGradeId(null);
    } else if (adsType?.id === AdsTypeEnum.Category) {
      setCollegeId(null);
      setCollegeYear(null);
      setGradeId(null);
    } else if (adsType?.id === AdsTypeEnum.Class) {
      setCollegeId(null);
      setCollegeYear(null);
      setSpecializedId(null);
    } else if (adsType?.id === AdsTypeEnum.College) {
      setSpecializedId(null);
      setGradeId(null);
    }
  }, [adsType?.id]);

  const {
    dispatchResetCrudState,
    isDeleting,
    dispatchAdding,
    isAdding,
    dispatchDeleting,
    dispatchEditing,
    getActionId,
    getSelectedData,
    isEditing,
  } = useCreateCrudState<IAds>();

  const adsQueryResult = adsQueries.useAdsInfiniteQuery({
    type:
      !!collegeId?.id || !!gradeId?.id || !!specializedId?.id
        ? null
        : adsType?.id.toString() || null,
    pageNumber: 0,
    pageSize: 6,
    collegeId: collegeId?.id || null,
    collegeYear: collegeYear?.id ? collegeYear?.id.toString() : null,
    gradeId: gradeId?.id || null,
    specializedId: specializedId?.id || null,
  });

  const noData =
    !adsQueryResult.data?.pages[0]?.data.data.length &&
    !adsQueryResult.isLoading;

  const handleDeleteSubmit = useCallback(async () => {
    try {
      await adsApi.removeAds(getActionId());
      await adsQueryResult.refetch();
      dispatchResetCrudState();
      showSuccess(t('forms.deleted-successfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [dispatchResetCrudState, getActionId, t, adsQueryResult]);

  const handleRemoveClick = useCallback(
    (removeId: number) => {
      dispatchDeleting({ actionId: removeId });
    },
    [dispatchDeleting],
  );

  const handleEditClick = useCallback(
    (editData: IAds) => {
      dispatchEditing({ selectedData: editData });
    },
    [dispatchEditing],
  );

  const handleSubmitAds = useCallback(
    async (
      onProgress: (p?: number) => void,
      abortHandlerRef: MutableRefObject<any>,
      { data, files }: TSubmitHandlerData<IAdsPayloadForm>,
    ) => {
      const payload: IAdsPayload = {
        ...data,
        id: getSelectedData()?.id || 0,
        type: data.type?.id || 1,
        // ||
        //   !!data.collegeId?.id ||
        //   !!data.specializedId ||
        //   !!data.gradeId?.id ||
        //   !!data.collegeYear?.id
        //     ? null
        //     : data.type?.id || 0,
        collegeId: data.collegeId?.id || null,
        collegeYear: data.collegeYear?.id ?? null,
        gradeId: data.gradeId?.id || null,
        specializedId: data.specializedId || null,
      };
      const formData = prepareAdsFormData({
        data: payload,
        files,
      });
      try {
        if (getSelectedData()?.id) {
          await adsApi.updateAds(formData);
          showSuccess(t('forms.edited-successfully'));
        } else {
          await adsApi.addAds(formData, onProgress, (handler) => {
            abortHandlerRef.current = handler;
          });
          showSuccess(t('forms.added-successfully'));
        }
        await adsQueryResult.refetch();
        dispatchResetCrudState();
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    [dispatchResetCrudState, getSelectedData, t, adsQueryResult],
  );

  return (
    <PageContainer
      title={t('ads.ads-title')}
      name={t('ads.ads-name').toString()}
      actionModalTitle={t('ads.add-ads').toString()}
      handleDeleteSubmit={handleDeleteSubmit}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      handleAddClick={dispatchAdding}
      setOpenActionModal={dispatchResetCrudState}
      permissionName="Ads"
      form={
        isLoadingCollege || isLoadingSpecialized || isLoadingGrades ? (
          <LoadingPlaceholder />
        ) : (
          <AdsForm
            editItem={getSelectedData()}
            onSubmit={(data) =>
              handleSubmitAds(setProgress, abortHandler, data)
            }
            onAbortClick={abortHandler.current}
            colleges={colleges}
            progress={progress}
            isLoadingCollege={isLoadingCollege}
            grades={grades}
            isLoadingGrades={isLoadingGrades}
            specialized={specialized}
            isLoadingSpecialized={isLoadingSpecialized}
            // minDate={minDate ? new Date(minDate) : undefined}
          />
        )
      }
      extra={
        <Box display="flex" gap={2}>
          <FilterAutoComplete
            defaultValue={adsType?.id || 0}
            onChange={(v) => setAdsType(v)}
            value={adsType}
            label={String(t('ads-form.type'))}
            options={
              AdsType.map((a) => ({
                id: a.id,
                name: t(`ads-form.${a.name}`),
              })) ?? []
            }
          />
          {adsType?.id === AdsTypeEnum.Class && (
            <FilterAutoComplete
              defaultValue={0}
              onChange={(v) => setGradeId(v)}
              value={gradeId}
              label={String(t('grades.grade'))}
              isLoading={isLoadingGrades}
              options={
                grades?.data.map((g) => ({
                  id: g.id,
                  name: g.name,
                })) || []
              }
            />
          )}
          {adsType?.id === AdsTypeEnum.College && (
            <>
              <FilterAutoComplete
                defaultValue={0}
                onChange={(v) => setCollegeId(v)}
                value={collegeId}
                label={String(t('yearlyProjects.college'))}
                isLoading={isLoadingCollege}
                options={
                  colleges?.data.map((g) => ({
                    id: g.id,
                    name: g.name,
                  })) || []
                }
              />
              <FilterAutoComplete
                defaultValue={0}
                onChange={(v) => setCollegeYear(v)}
                value={collegeYear}
                label={String(t('college-details-form.year'))}
                options={Years.map((y) => ({
                  id: y.id,
                  name: t(y.name),
                }))}
                disabled={!collegeId}
              />
            </>
          )}
          {adsType?.id === AdsTypeEnum.Category && (
            <NestedSelectComponent
              items={
                specialized?.data?.map((special) =>
                  makeNestedItemsFromSpecialized(special),
                ) || []
              }
              isLoading={isLoadingSpecialized}
              value={specializedId?.id ?? 0}
              onChange={(value) => {
                setSpecializedId(
                  value
                    ? {
                        id: value,
                        name: getNameById(
                          specialized?.data || [],
                          String(value),
                        ),
                      }
                    : null,
                );
              }}
            />
          )}
        </Box>
      }
    >
      <Grid container spacing={2} mt={5}>
        <InfiniteListWrapper
          infiniteQueryResult={adsQueryResult}
          loadingComponent={<LoadingPlaceholder />}
          noDataComponent={<NoData />}
          noDataOverride={noData}
        >
          {(pages) =>
            pages
              .flatMap((p) => p.data.data)
              .reverse()
              .map((ads) => (
                <Grid item sm={6} md={4} key={ads.id}>
                  <AdsCard
                    ads={ads}
                    handleEditClick={handleEditClick}
                    handleRemoveClick={handleRemoveClick}
                  />
                </Grid>
              ))
          }
        </InfiniteListWrapper>
      </Grid>
    </PageContainer>
  );
}

export default ProtectPage({
  Page: AdsPage,
  controllerName: ControllersNames.Ads,
});
