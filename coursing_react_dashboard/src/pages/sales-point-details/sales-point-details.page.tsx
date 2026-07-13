/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useMemo, useRef, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { showSuccess } from 'libs/react.toastify';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import {
  IGeneratePointsPayloadForm,
  IGeneratePointsPayload,
  IPointsCodes,
  IPointsForSalePoint,
  IChangeCodeStatusPayloadForm,
  IChangeCodeStatusPayload,
} from 'apis/sales-point/sales-point.interfaces';
import salesPointApi from 'apis/sales-point/sales-point.api';
import { useTranslation } from 'react-i18next';
import salesPointQueries from 'apis/sales-point/sales-point.queries';
import { useParams } from 'react-router-dom';
import GeneratePointsForSalePoint from 'components/forms/sales-point/generate-points.form';
import QRCode from 'react-qr-code';
import QrModal from 'components/common/qr-modal';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { ControllersNames, codeStatus } from 'constants/constants';
import { generateFriendlyDate } from 'utils/helpers';
import { Button, Typography } from '@mui/material';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import ChangeCodeStatusForm from 'components/forms/sales-point/change-code-status.form';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import ProtectPage from 'components/common/protect-page/protectPage';
import { useReactToPrint } from 'react-to-print';
import ThemeVariables from 'theme/theme-variables';
import CodeStatusBadge from './components/code-status-badge.cpmponent';
import CodespaperComponent from './components/codes-paper.component';

function SalesPointDetailsPage() {
  const {
    dispatchAdding,
    dispatchDeleting,
    dispatchResetCrudState,
    isAdding,
    isDeleting,
    getActionId,
    isEditing,
  } = useCreateCrudState<IPointsForSalePoint>();

  const { t } = useTranslation();

  const [showActionProgress, setShowActionProgress] = useState(false);

  const [openQrModal, setOpenQrModal] = useState(false);

  const [openChangeCodeStatus, setOpenChangeCodeStatus] = useState(false);

  // const [openCodesCardsModal, setOpenCodesCardsModal] = useState(false);

  const [selectedData, setSelectedData] = useState<IPointsCodes>();

  const [qrLink, setQrLink] = useState<string>('');

  const param = useParams();

  const SalePointId = param.id;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: salesPointDetails,
    isLoading: isLoadingSalesPointDetails,
    refetch,
  } = salesPointQueries.usePointsForSalesPointQuery({
    salesPointId: Number(SalePointId),
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { data: salePoint } = salesPointQueries.useSalesPointDetailsQuery(
    Number(SalePointId),
  );

  function CopyText(text) {
    navigator.clipboard.writeText(text);
    showSuccess(t('common.textCopiedSuccessfully'));
  }

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleEditStatusClick = (data) => {
    setSelectedData(data);
    setOpenChangeCodeStatus(true);
  };

  const handleRemovePoints = async () => {
    setShowActionProgress(true);
    try {
      await salesPointApi.RemovePoints(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);

      setShowActionProgress(false);
    }
  };

  const handleSalesPointAction = async ({
    data,
  }: TSubmitHandlerData<IGeneratePointsPayloadForm>) => {
    try {
      const Payload: IGeneratePointsPayload = {
        ...data,
        salesPointId: Number(SalePointId),
        expiredate: new Date(data.expiredate).toISOString(),
      };
      await salesPointApi.generatePoint(Payload);
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataAddedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleChangeCodeStatusAction = async ({
    data,
  }: TSubmitHandlerData<IChangeCodeStatusPayloadForm>) => {
    const payloadData: IChangeCodeStatusPayload = {
      ...data,
      codeId: selectedData?.id || 0,
      statusCode: data.statusCode.id,
    };
    try {
      await salesPointApi.changeCodeStatus(
        payloadData.codeId,
        payloadData.statusCode,
      );
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataUpdatedSuccessfully'));
      setOpenChangeCodeStatus(!openChangeCodeStatus);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<IPointsCodes>[]>(
    () => [
      {
        accessorFn: (originalRow) => originalRow.code,
        header: t('salesPoints.qr'),
        Cell: ({ cell }) => (
          <QRCode
            onClick={() => {
              setOpenQrModal(true);
              setQrLink(String(cell.getValue<string>()));
            }}
            size={75}
            value={cell.getValue<string>()}
          />
        ),
      },
      {
        accessorFn: (originalRow) => originalRow.code,
        header: t('salesPoints.code'),
        Cell: ({ cell }) => (
          <Typography
            dir="ltr"
            onClick={() => CopyText(cell.getValue<string>())}
            title={cell.getValue<string>()}
            sx={{ lineBreak: 'anywhere' }}
          >
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'point',
        header: t('salesPoints.points'),
      },
      {
        accessorKey: 'codeStatus',
        header: t('salesPoints.status'),
        Cell: ({ cell }) => (
          <CodeStatusBadge
            status={cell.getValue<number>()}
            text={t(getNameById(codeStatus, cell.getValue<string>()))}
          />
        ),
      },
      {
        accessorKey: 'expireDate',
        header: t('salesPoints.expireDate'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
    ],
    [t],
  );

  const SalesPointTable = GenericTablePage<IPointsCodes>;

  const printContainerRef = useRef<any>();
  const print = useReactToPrint({ content: () => printContainerRef.current });

  return (
    <>
      <SalesPointTable
        form={<GeneratePointsForSalePoint onSubmit={handleSalesPointAction} />}
        columns={columns}
        data={salesPointDetails?.data || []}
        name={String(t('salesPoints.points'))}
        title={salePoint?.name || String(t('salesPoints.points'))}
        isLoading={isLoadingSalesPointDetails}
        openDeleteModal={isDeleting}
        setOpenDeleteModal={dispatchResetCrudState}
        handleAddClick={dispatchAdding}
        openActionModal={isAdding || isEditing}
        handleEditClick={handleEditStatusClick}
        setOpenActionModal={dispatchResetCrudState}
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={salesPointDetails?.totalRecords || 0}
        withActionProgress={showActionProgress}
        actionModalTitle={String(t('salesPoints.addPoints'))}
        handleRemoveClick={handleRemoveClick}
        handleDeleteSubmit={handleRemovePoints}
        permissionName="SalesPoint"
        extraButtons={
          <Button
            type="submit"
            onClick={print}
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <span style={{ color: ThemeVariables.PRIMARY_COLOR }}>
              {t('salesPoints.print')}
            </span>
            <LocalPrintshopIcon
              style={{
                color: ThemeVariables.PRIMARY_COLOR,
                fontSize: '1.2em',
              }}
            />
          </Button>
        }
      >
        <FadeModal
          width={500}
          open={!!openChangeCodeStatus}
          setOpen={setOpenChangeCodeStatus}
          modalTitle={t('requestPaper.changeStatus').toString()}
        >
          <ChangeCodeStatusForm
            editItem={selectedData || null}
            onSubmit={handleChangeCodeStatusAction}
          />
        </FadeModal>
      </SalesPointTable>

      <QrModal
        open={openQrModal}
        handleClose={() => {
          setOpenQrModal(false);
        }}
        Link={qrLink}
      />
      <div style={{ display: 'none' }}>
        <CodespaperComponent
          codes={salesPointDetails?.data || []}
          ref={printContainerRef}
          address={salePoint?.address}
        />
      </div>
    </>
  );
}

export default ProtectPage({
  Page: SalesPointDetailsPage,
  controllerName: ControllersNames.SalesPoint,
});
