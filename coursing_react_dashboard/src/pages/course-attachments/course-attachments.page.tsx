/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable object-shorthand */
import useSearchParams from 'hooks/use-search-params/use-search-params';
import attachmentsQueries from 'apis/attachments/attachments.queries';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import {
  IAttachments,
  IAttachmentsPayload,
  IAttachmentsPayloadForm,
} from 'apis/attachments/attachments.interfaces';
import { Grid } from '@mui/material';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import AttachmentsForm from 'components/forms/attachments/attachments.form';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import NoData from 'components/common/no-data/no-data.component';
import PageContainer from 'components/common/page-container/page-container.component';
import { showError, showSuccess } from 'libs/react.toastify';
import attachmentsApi from 'apis/attachments/attachments.api';
import { useTranslation } from 'react-i18next';
import prepareAttachmentsFormData from 'components/forms/attachments/helper/prepare-attachments-form-data';
import { InfiniteListWrapper } from '@craft-code/react-helper-utils';
import routesNames from 'routes/constants';
import { useLocation } from 'react-router-dom';
import SortableList, { SortableItem } from '@reyhappen/react-easy-sort';
import AttachmentsCard from './components/attachments-card.components';

type Props = {
  extendedPageTitle?: string;
};
function CourseAttachments({ extendedPageTitle }: Props) {
  const { t } = useTranslation();
  const { pathname = '' } = useLocation();

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

  const isUniversity = pathname === routesNames.universityCourses;
  const isSchool = pathname === routesNames.schoolCourses;
  const isSpecialized = pathname === routesNames.specializedCourses;

  const isUniversitySubject = pathname === routesNames.collegeSubjectsDetails;

  const isSchoolSubject = pathname === routesNames.schoolSubjectsDetails;

  const courseId = useSearchParams('course');

  const subjectId = useSearchParams('subject');

  const {
    dispatchEditing,
    dispatchResetCrudState,
    getSelectedData,
    isDeleting,
    dispatchAdding,
    isEditing,
    isAdding,
  } = useCreateCrudState<IAttachments>();

  const attachmentResult = attachmentsQueries.useAttachmentInfiniteQuery({
    courseId: courseId ? courseId : null,
    collegeDetailsSubjectId: isUniversity
      ? 0
      : isUniversitySubject
      ? subjectId
      : null,
    gradeSubjectId: isSchool ? 0 : isSchoolSubject ? subjectId : null,
    specializedId: isSpecialized ? 0 : null,
    pageNumber: 0,
    pageSize: 6,
  });

  const handleEditClick = useCallback(
    (data: IAttachments) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleAttachmentsAction = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    payloadData: TSubmitHandlerData<IAttachmentsPayloadForm>,
  ) => {
    const { data, files } = payloadData;
    const formPayload: IAttachmentsPayload = {
      ...data,
      courseId: courseId ? courseId : null,
      collegeDetailsSubjectId: isUniversity
        ? 0
        : isUniversitySubject
        ? subjectId
        : null,
      gradeSubjectId: isSchool ? 0 : isSchoolSubject ? subjectId : null,
      specializedId: isSpecialized ? 0 : null,
    };
    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        const formData = prepareAttachmentsFormData({
          data: payload,
          files,
        });
        await attachmentsApi.updateAttachments(
          formData,
          onProgress,
          (handler) => {
            abortHandlerRef.current = handler;
          },
        );
        await attachmentResult.refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formData = prepareAttachmentsFormData({
          data: formPayload,
          files,
        });
        await attachmentsApi.addAttachments(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await attachmentResult.refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const [orderedAttachments, setOrderedAttachments] = useState<IAttachments[]>(
    [],
  );
  useEffect(() => {
    setOrderedAttachments(
      attachmentResult.data?.pages.flatMap((p) => p.data.data) ?? [],
    );
  }, [attachmentResult.data?.pages]);

  const handleOrderChange = async (oldIdx: number, newIdx: number) => {
    const start = Math.min(oldIdx, newIdx);
    const end = Math.max(oldIdx, newIdx);
    const desc = oldIdx > newIdx;

    const target = orderedAttachments[oldIdx];

    const effectedItems = orderedAttachments.slice(
      desc ? start : start + 1,
      desc ? end : end + 1,
    );
    const orderList = effectedItems
      .map((i) => i.order)
      .concat(target.order) as number[];
    const targetNewOrder = desc
      ? Math.max(...orderList)
      : Math.min(...orderList);

    setOrderedAttachments((prev) => {
      const newArray = [...prev];
      newArray.splice(desc ? end : start, 1);
      newArray.splice(desc ? start : end, 0, target);
      return newArray;
    });

    try {
      await attachmentsApi.updateAttachmentsOrder(target.id!, targetNewOrder);
      await Promise.all([
        ...effectedItems.map((item) =>
          attachmentsApi.updateAttachmentsOrder(
            item.id!,
            desc ? (item.order ?? 0) - 1 : (item.order ?? 0) + 1,
          ),
        ),
      ]);
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error) {
      console.error(error);
      showError(t('common.somethingWentWrong'));
    }
    attachmentResult.refetch();
  };

  return (
    <PageContainer
      title={`${String(t('courses.attachmentsDetails'))}${
        extendedPageTitle?.length ? `/${extendedPageTitle}` : ``
      }`}
      name={String(t('courses.attachments'))}
      actionModalTitle={
        isEditing
          ? String(t('courses.editAttachment'))
          : String(t('courses.addAttachment'))
      }
      handleAddClick={dispatchAdding}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      permissionName="forceAllow"
      form={
        <AttachmentsForm
          onAbortClick={abortHandler.current}
          progress={progress}
          editItem={getSelectedData()}
          onSubmit={(data) =>
            handleAttachmentsAction(setProgress, abortHandler, data)
          }
        />
      }
    >
      <SortableList onSortEnd={handleOrderChange}>
        <Grid container spacing={2} mt={5}>
          <InfiniteListWrapper
            infiniteQueryResult={attachmentResult}
            loadingComponent={<LoadingPlaceholder />}
            noDataOverride={
              !attachmentResult.isLoading &&
              !attachmentResult.data?.pages[0].data.data.length
            }
            noDataComponent={<NoData />}
          >
            {() =>
              orderedAttachments.map((attachment) => (
                <SortableItem key={attachment.id}>
                  <Grid item md={4}>
                    <AttachmentsCard
                      handleEditClick={handleEditClick}
                      item={attachment}
                    />
                  </Grid>
                </SortableItem>
              ))
            }
          </InfiniteListWrapper>
        </Grid>
      </SortableList>
    </PageContainer>
  );
}

export default CourseAttachments;
