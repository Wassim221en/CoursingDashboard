import {
  ITimeOfBegin,
  IVideoSection,
  IVideoSectionPayload,
  IVideoSectionPayloadForm,
} from 'apis/video-sections/video-sections.interface';
import videoSectionsQueries from 'apis/video-sections/video-sections.queries';
import VideoSection from 'components/forms/video-section/video-section.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import NotFoundPage from 'pages/error-pages/not-found.page';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import prepareVideoSectionsFormData from 'components/forms/video-section/helper/prepare-video-sections-data';
import videoSectionApi from 'apis/video-sections/video-sections.apis';
import { showSuccess } from 'libs/react.toastify';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import CellImage from 'components/common/cell-image/cell-image.component';

function VideoSections() {
  const videoId = useSearchParams('video');
  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 1000,
  });

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
  } = useCreateCrudState<IVideoSection>();

  const {
    data: videoSectionsQueryResult,
    isLoading: isLoadingVideoSection,
    refetch,
  } = videoSectionsQueries.useVideoSectionQuery({
    videoId: !Number.isNaN(videoId) ? videoId : 0,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleDeleteSubmit = useCallback(async () => {
    try {
      await videoSectionApi.removeVideoSection(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('forms.deleted-successfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [dispatchResetCrudState, getActionId, refetch, t]);

  const handleRemoveClick = useCallback(
    (removeId: number) => {
      dispatchDeleting({ actionId: removeId });
    },
    [dispatchDeleting],
  );

  const handleEditClick = useCallback(
    (editData: IVideoSection) => {
      dispatchEditing({ selectedData: editData });
    },
    [dispatchEditing],
  );

  const handleSubmitVideoSections = useCallback(
    async ({ data, files }: TSubmitHandlerData<IVideoSectionPayloadForm>) => {
      const payload: IVideoSectionPayload = {
        videoId,
        // order: data.order,
        videoSectionDetails: {
          order: data.order,
          id: getSelectedData()?.id ?? 0,
          image: files[0]?.fileObject!,
          timeOfBegin: {
            houres: new Date(data.timeBegin).getHours(),
            minutes: new Date(data.timeBegin).getMinutes(),
            seconds: new Date(data.timeBegin).getSeconds(),
          },
          title: data.title,
        },
      };
      const formData = prepareVideoSectionsFormData({
        data: payload,
      });
      try {
        if (getSelectedData()?.id) {
          await videoSectionApi.updateVideoSection(formData);
          showSuccess(t('forms.edited-successfully'));
        } else {
          await videoSectionApi.addVideoSection(formData);
          showSuccess(t('forms.added-successfully'));
        }
        await refetch();
        dispatchResetCrudState();
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    [dispatchResetCrudState, getSelectedData, refetch, t, videoId],
  );

  const columns = useMemo<MRT_ColumnDef<IVideoSection>[]>(
    () => [
      {
        accessorKey: 'imageUrl',
        header: t('common.image'),
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ cell }) => <CellImage imageSrc={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'title',
        header: t('common.title'),
      },
      {
        accessorKey: 'order',
        header: t('video-sections.order'),
      },
      {
        accessorKey: 'timeOfBegin',
        header: t('video-sections.timeOfBegin'),
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ cell }) => (
          <Typography>
            {cell.getValue<ITimeOfBegin>().houres}:
            {cell.getValue<ITimeOfBegin>().minutes}:
            {cell.getValue<ITimeOfBegin>().seconds}
          </Typography>
        ),
      },
      {
        accessorKey: 'timeOfBegin',
        header: t('video-sections.timeOfEnd'),
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ table, row }) => (
          <Typography>
            {table.options?.data[Number(row.index + 1)]?.timeOfBegin
              ? `${
                  table.options?.data[Number(row.index + 1)]?.timeOfBegin
                    ?.houres
                }:${
                  table.options?.data[Number(row.index + 1)]?.timeOfBegin
                    ?.minutes
                }:${
                  table.options?.data[Number(row.index + 1)]?.timeOfBegin
                    ?.seconds
                }`
              : t('video-sections.toEnd')}
          </Typography>
        ),
      },
    ],
    [t],
  );

  const VideoSectionsTable = GenericTablePage<IVideoSection>;

  if (!videoId) return <NotFoundPage />;

  return (
    <VideoSectionsTable
      data={[...(videoSectionsQueryResult?.data || [])].reverse() || []}
      columns={columns}
      isLoading={isLoadingVideoSection}
      title={t('video-sections.video-sections-title')}
      name={t('video-sections.video-sections-name').toString()}
      actionModalTitle={t('video-sections.add-section').toString()}
      handleDeleteSubmit={handleDeleteSubmit}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      handleAddClick={dispatchAdding}
      handleEditClick={handleEditClick}
      handleRemoveClick={handleRemoveClick}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      permissionName="forceAllow"
      form={
        <VideoSection
          editItem={getSelectedData()}
          onSubmit={handleSubmitVideoSections}
        />
      }
    />
  );
}

export default VideoSections;
