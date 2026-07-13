/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unstable-nested-components */
import studentQueries from 'apis/student/student.queries';
import PageContainer from 'components/common/page-container/page-container.component';
import { useParams } from 'react-router-dom';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import {
  IAddPointsToStudentPayload,
  IGeneratePointsFromBaseSalesPoint,
} from 'apis/student/student.interfaces';
import AddPointsToStudentForm from 'components/forms/add-points-to-student/add-points-to-student.form';
import { useTranslation } from 'react-i18next';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import studentApi from 'apis/student/student.api';
import { showSuccess } from 'libs/react.toastify';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import GeneratePointsFromBaseSalesPointFrom from 'components/forms/add-points-to-student/generate-points-from-base-salesPoint.form';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MRT_ColumnDef } from 'material-react-table';
import { IPointsCodes } from 'apis/sales-point/sales-point.interfaces';
import QRCode from 'react-qr-code';
import { generateFriendlyDate, truncateString } from 'utils/helpers';
import CodeStatusBadge from 'pages/sales-point-details/components/code-status-badge.cpmponent';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { codeStatus } from 'constants/constants';
import { motion } from 'framer-motion';
import NoData from 'components/common/no-data/no-data.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import QrModal from 'components/common/qr-modal';
import Balancecard from './components/balance-card.component';

function StudentPoints() {
  const { id: studentId } = useParams();
  const { t } = useTranslation();
  const { isEditing, isAdding } =
    useCreateCrudState<IAddPointsToStudentPayload>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [openPontsModal, setOpenPointsModal] = useState(false);

  const [returnedCode, setReturnedCode] = useState(null);

  const [openQrModal, setOpenQrModal] = useState(false);

  const [qrLink, setQrLink] = useState<string>('');

  const [activeTab, setActiveTab] = useState(0);

  const {
    data: studentBalance,
    refetch,
    isLoading: isLoadingStudentBalance,
  } = studentQueries.useStudentBalanceQuery(Number(studentId));

  function CopyText(text) {
    navigator.clipboard.writeText(text);
    showSuccess(t('common.textCopiedSuccessfully'));
  }

  const handleAddPointsToStudent = async (
    data: TSubmitHandlerData<IAddPointsToStudentPayload>,
  ) => {
    const formPayload: IAddPointsToStudentPayload = {
      studentId: Number(studentId),
      salePointCode: data.data.salePointCode,
    };
    try {
      await studentApi.addPointsToStudents(formPayload);
      await refetch();
      showSuccess(t('common.dataAddedSuccessfully'));
      setOpenPointsModal(false);
      setReturnedCode(null);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleGeneratePointsFromBaseSalesPoint = async (
    data: TSubmitHandlerData<IGeneratePointsFromBaseSalesPoint>,
  ) => {
    const formPayload: IGeneratePointsFromBaseSalesPoint = {
      numberOfPoints: data.data.numberOfPoints,
    };
    try {
      const response = await studentApi.generateCodeFromBaseSalesPoint(
        formPayload.numberOfPoints,
      );
      setReturnedCode(response.data);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<IPointsCodes>[]>(
    () => [
      {
        accessorKey: 'code',
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
        accessorKey: 'code',
        header: t('salesPoints.code'),
        Cell: ({ cell }) => (
          <Typography dir="ltr" title={cell.getValue<string>()}>
            {truncateString(cell.getValue<string>(), 10)}
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

  const StudentPointsHistoryTable = GenericTablePage<IPointsCodes>;

  return (
    <PageContainer
      title={String(t('salesPoints.points'))}
      name={String(t('salesPoints.points'))}
      actionModalTitle={String(t('salesPoints.addPoints'))}
      handleAddClick={() => setOpenPointsModal(true)}
      openActionModal={isAdding || isEditing}
      form=""
      permissionName="Student"
    >
      {isLoadingStudentBalance ? (
        <LoadingPlaceholder />
      ) : (
        <>
          <Balancecard
            studentId={Number(studentId)}
            balance={studentBalance?.balance || 0}
            refetch={refetch}
          />
          <Box pb={20}>
            <StudentPointsHistoryTable
              form=""
              columns={columns}
              data={studentBalance?.codes || []}
              name={String(t('students.pointsHistory'))}
              title={String(t('students.pointsHistory'))}
              isLoading={isLoadingStudentBalance}
              withActionProgress={false}
              pagination={pagination}
              withoutActions
              permissionName="Student"
            />
          </Box>
        </>
      )}

      <FadeModal
        width={800}
        open={openPontsModal!}
        setOpen={setOpenPointsModal}
        modalTitle={String(t('salesPoints.addPoints'))}
      >
        <Tabs
          sx={{ py: 2 }}
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
        >
          <Tab value={0} label={t('salesPoints.addCodeFromSalesPoint')} />
          <Tab value={1} label={t('salesPoints.GenerateNewCode')} />
        </Tabs>

        <Box py={2}>
          {activeTab === 0 ? (
            <motion.div
              animate={{
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
              }}
            >
              <AddPointsToStudentForm
                editItem={null}
                onSubmit={handleAddPointsToStudent}
              />
            </motion.div>
          ) : activeTab === 1 ? (
            <motion.div
              animate={{
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
              }}
            >
              <Box>
                {returnedCode && (
                  <Box
                    sx={{
                      maxWidth: '100%',
                      bgcolor: '#ececec',
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderRadius: 2,
                      my: 4,
                      cursor: 'pointer',
                      p: 2,
                      mx: 'auto',
                    }}
                    onClick={() => CopyText(returnedCode)}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 25 }}>
                      {returnedCode}
                    </Typography>
                    <ContentCopyIcon />
                  </Box>
                )}
              </Box>
              <GeneratePointsFromBaseSalesPointFrom
                editItem={null}
                onSubmit={handleGeneratePointsFromBaseSalesPoint}
              />
            </motion.div>
          ) : (
            <NoData />
          )}
        </Box>
      </FadeModal>
      <QrModal
        open={openQrModal}
        handleClose={() => {
          setOpenQrModal(false);
        }}
        Link={qrLink}
      />
    </PageContainer>
  );
}

export default StudentPoints;
