/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import cityQueries from 'apis/city/city.queries';
import collegeQueries from 'apis/college/college.queries';
import gradeQueries from 'apis/grade/grade.queries';
import {
  IChangeStudentAccountStatusPayload,
  IChangeStudentAccountStatusPayloadForm,
  IChangeStudentStatePayload,
  IStudent,
} from 'apis/student/student.interfaces';
import studentQueries from 'apis/student/student.queries';
import universityQueries from 'apis/university/university.queries';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import {
  ControllersNames,
  StudentGender,
  StudentStateOptions,
  accountStatus,
  studentType,
} from 'constants/constants';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { showSuccess } from 'libs/react.toastify';
import { MRT_ColumnDef } from 'material-react-table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import authApi from 'apis/auth/auth.api';
import routesNames from 'routes/constants';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import ChangeAccountStatusForm from 'components/forms/student/change-account-status.form';
import ProtectPage from 'components/common/protect-page/protectPage';
import useDebounce from 'hooks/use-debounce/useDebounce';
import FilterString from 'components/common/filter-string/filter-string.component';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import studentApi from 'apis/student/student.api';
import { generateFriendlyDate } from 'utils/helpers';
import EditIcon from '@mui/icons-material/Edit';
import GenericAutoCompleteComponent from 'hooks/use-generic-form/components/generic-auto-complete/generic-auto-complete.component';
import AccountStatusBadge from './components/accountStatus-badge';

function StudentPage() {
  const { t } = useTranslation();
  const {
    dispatchResetCrudState,
    isEditing,
    dispatchEditing,
    getSelectedData,
    dispatchDeleting,
    getActionId,
    isDeleting,
  } = useCreateCrudState<IStudent>();
  const navigate = useNavigate();

  function CopyText(text) {
    navigator.clipboard.writeText(text);
    showSuccess(t('common.textCopiedSuccessfully'));
  }

  const [showActionProgress, setShowActionProgress] = useState(false);

  const [openResetCodeModal, setOpenResetCodeModal] = useState(false);

  const [resetCode, setResetCode] = useState<number | null>();

  const [studentTypeId, setStudentTypeId] = useState<TAutoComplete | null>(
    null,
  );

  // university filters
  const [universityId, setUniversityId] = useState<TAutoComplete | null>(null);

  const [collegeId, setCollegeId] = useState<TAutoComplete | null>(null);

  // school filters
  const [gradeId, setGradeId] = useState<TAutoComplete | null>(null);

  // city filters
  const [cityId, setCityId] = useState<TAutoComplete | null>(null);

  // gender filters

  const [genderId, setGenderId] = useState<TAutoComplete | null>(null);

  // text filters

  const [query, setQuery] = useState('');

  const queryString = useDebounce(query, 500);

  // filters queries
  const { data: grades } = gradeQueries.useGradesQuery();

  const { data: universities } = universityQueries.useUniversitiesQuery({});

  const { data: colleges } = collegeQueries.useCollegesQuery({
    universityId: universityId?.id,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  });

  const {
    data: students,
    refetch,
    isLoading,
  } = studentQueries.useStudentsQuery({
    studentType: studentTypeId?.id,
    collegeId: collegeId?.id,
    gradeId: gradeId?.id,
    universityId: universityId?.id,
    cityId: cityId?.id,
    gender: genderId?.id,
    text: queryString,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { data: cities, isLoading: isLoadingCities } =
    cityQueries.useCitiesQuery();

  const handleEditClick = useCallback(
    (data: IStudent) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleRemoveAccount = async () => {
    setShowActionProgress(true);
    try {
      await authApi.removeAccount(getActionId(), true);
      await refetch();
      showSuccess(t('common.dataDeletedSuccessfully'));
      setShowActionProgress(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handleChangeAccountStatusAction = async ({
    data,
  }: TSubmitHandlerData<IChangeStudentAccountStatusPayloadForm>) => {
    const payloadData: IChangeStudentAccountStatusPayload = {
      ...data,
      accountStatus: data.accountStatus.id,
    };
    try {
      const payload = { ...payloadData, studentId: getSelectedData()?.id };

      await studentApi.changeStudentAccountStatus(payload);
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangStudentStateAction = async ({
    studentId,
    studentState,
  }: {
    studentId: number;
    studentState: number;
  }) => {
    const payloadData: IChangeStudentStatePayload = {
      studentId,
      studentState,
    };
    try {
      const payload = { ...payloadData };
      await studentApi.UpdateStudentState(payload);
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleGenerateResetCode = async (id: number) => {
    setOpenResetCodeModal(true);
    try {
      const response = await authApi.generateResetCode(id);
      setResetCode(response);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleDetailsClick = useCallback(
    (data: IStudent) => {
      navigate(`${routesNames.students}/${data.id}`);
    },
    [navigate],
  );

  const columns = useMemo<MRT_ColumnDef<IStudent>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: t('common.fullName'),
        Cell: ({ row }) => (
          <Box>
            <Typography>
              {row.original.firstName} {row.original.lastName}
            </Typography>
          </Box>
        ),
        size: 50,
      },
      {
        accessorKey: 'gender',
        header: t('students.gender'),
        Cell: ({ row }) => (
          <Box>
            <Typography>
              {t(getNameById(StudentGender, String(row.original?.gender)))}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'code',
        header: t('students.code'),
      },
      {
        accessorKey: 'joinDate',
        header: t('users.join-date'),
        Cell: ({ row }) => (
          <Box>
            <Typography>
              {t(generateFriendlyDate(row.original.joinDate))}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'studentType',
        header: t('students.studnetType'),
        Cell: ({ cell }) =>
          t(getNameById(studentType, cell.getValue<string>())),
      },
      {
        accessorKey: 'phoneNumber',
        header: t('users.phoneNumber'),
      },
      {
        accessorKey: 'city.country.name',
        header: t('countries.country'),
      },
      {
        accessorKey: 'city.name',
        header: t('cities.city'),
      },
      {
        accessorKey: 'grade.name',
        header: t('grades.grade'),
        Cell: ({ row }) => (
          <Box>
            <Typography>{row.original?.grade?.name || ''}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'balance',
        header: t('students.points'),
      },
      {
        accessorKey: 'courseCount',
        header: t('students.courseCount'),
      },
      {
        accessorKey: 'accountStatus',
        header: t('students.accountStatus'),
        Cell: ({ cell }) => (
          <AccountStatusBadge
            status={cell.getValue<number>()}
            text={t(getNameById(accountStatus, cell.getValue<string>()))}
          />
        ),
      },
      {
        accessorKey: 'studentState',
        header: t('students.accountStatus'),
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>
              {t(
                StudentStateOptions.find(
                  (option) => Number(option.id) === cell.getValue<number>(),
                )?.name || 'غير مشترك',
              )}
            </Typography>
            <IconButton
              key={`${cell.getValue<number>()} ${cell.getValue<string>()}`}
              // alt="Change Account Status"
            >
              <ChangeAccountStatusDialog
                ButtonAcceptClick={(studentStateId) =>
                  handleChangStudentStateAction({
                    studentId: cell.row.original.id,
                    studentState: studentStateId,
                  })
                }
                defState={StudentStateOptions.find(
                  (option) => Number(option.id) === cell.getValue<number>(),
                )}
                customTitle={t('students.accountStatus').toString()}
                customDescription={t(
                  'students.accountStatusDescription',
                ).toString()}
              />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleChangStudentStateAction, t],
  );

  const StudentTable = GenericTablePage<IStudent>;

  return (
    <StudentTable
      form={
        <ChangeAccountStatusForm
          onSubmit={handleChangeAccountStatusAction}
          editItem={getSelectedData()}
        />
      }
      columns={columns}
      data={students?.data || []}
      name="Student"
      title={t('common.students')}
      isLoading={isLoading}
      openActionModal={isEditing}
      setOpenActionModal={dispatchResetCrudState}
      // extraActions={(data) => (
      //   <IconButton
      //     key={`${data.id} ${data.fullName}`}
      //     // alt="Change Account Status"
      //   >
      //     <ChangeAccountStatusDialog
      //       ButtonAcceptClick={(studentStateId) =>
      //         handleChangStudentStateAction({
      //           studentId: data.id,
      //           studentState: studentStateId,
      //         })
      //       }
      //       defState={StudentStateOptions.find(
      //         (option) => Number(option.id) === data.studentState,
      //       )}
      //       customTitle={t('students.accountStatus')}
      //       customDescription={t('students.accountStatusDescription')}
      //     />
      //   </IconButton>
      // )}
      handleEditClick={handleEditClick}
      handleRemoveClick={handleRemoveClick}
      openDeleteModal={isDeleting}
      handleDeleteSubmit={handleRemoveAccount}
      setOpenDeleteModal={dispatchResetCrudState}
      actionModalTitle={String(t('students.accountStatus'))}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={students?.totalRecords || 0}
      withActionProgress={showActionProgress}
      handleDetailsClick={handleDetailsClick}
      detailsTooltip="Student Details"
      handleAddItemClick={(data) => handleGenerateResetCode(data.id)}
      addTooltip="Generate Reset Code"
      permissionName="Student"
      extra={
        <Box>
          <Grid container gap={2} sx={{ py: 2 }}>
            <FilterString query={query} setQuery={setQuery} />
            <FilterAutoComplete
              defaultValue={studentTypeId?.id || 0}
              onChange={(v) => setStudentTypeId(v)}
              value={studentTypeId}
              label={String(t('students.studnetType'))}
              options={studentType ?? []}
            />
            <FilterAutoComplete
              defaultValue={genderId?.id || 0}
              onChange={(v) => setGenderId(v)}
              value={genderId}
              label={String(t('students.gender'))}
              options={
                StudentGender.map((gender) => ({
                  id: gender.id,
                  name: t(gender.name),
                })) ?? []
              }
            />
            <FilterAutoComplete
              defaultValue={cityId?.id || 0}
              onChange={(v) => setCityId(v)}
              value={cityId}
              label={String(t('cities.city'))}
              isLoading={isLoadingCities}
              options={cities?.data ?? []}
            />
            <Typography sx={{ textAlign: 'center', marginY: 'auto' }}>
              {' '}
              عدد الطلاب: {students?.totalRecords ?? 0}
            </Typography>
          </Grid>
          <Divider />
          {studentTypeId?.id === 1 && (
            <Box sx={{ py: 2 }}>
              <FilterAutoComplete
                defaultValue={gradeId?.id || 0}
                onChange={(v) => setGradeId(v)}
                value={gradeId}
                label={String(t('grades.grades'))}
                options={grades?.data ?? []}
                disabled={!!universityId?.id}
              />
            </Box>
          )}
          {studentTypeId?.id === 2 && (
            <Grid container gap={2} py={3}>
              <FilterAutoComplete
                defaultValue={universityId?.id || 0}
                onChange={(v) => setUniversityId(v)}
                value={universityId}
                label={String(t('universities.universities'))}
                options={universities?.data ?? []}
                disabled={!!gradeId?.id}
              />
              <FilterAutoComplete
                defaultValue={collegeId?.id || 0}
                onChange={(v) => setCollegeId(v)}
                value={collegeId}
                label={String(t('universities.colleges'))}
                options={colleges?.data ?? []}
                disabled={!universityId?.id}
              />
            </Grid>
          )}
          <FadeModal
            width={500}
            open={openResetCodeModal}
            setOpen={setOpenResetCodeModal}
            modalTitle={String(t('students.generateResetCode'))}
            onClose={() => setResetCode(null)}
          >
            <Box>
              {resetCode ? (
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
                  onClick={() => CopyText(resetCode)}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: 25 }}>
                    {resetCode}
                  </Typography>
                  <ContentCopyIcon />
                </Box>
              ) : (
                <LoadingPlaceholder />
              )}
            </Box>
          </FadeModal>
        </Box>
      }
    />
  );
}

export default ProtectPage({
  Page: StudentPage,
  controllerName: ControllersNames.Students,
});

interface IChangeAccountStatusDialogProps {
  ButtonAcceptClick?: (setStudentStateId: number) => void;
  customDescription?: string;
  customTitle?: string;
  defState?: TAutoComplete;
}
function ChangeAccountStatusDialog({
  ButtonAcceptClick,
  customTitle,
  customDescription,
  defState,
}: IChangeAccountStatusDialogProps) {
  const [studentState, setStudentState] = useState<TAutoComplete | null>(
    defState || null,
  );

  const handleAccept = (id: number) => {
    ButtonAcceptClick?.(id);
    setStudentState?.(StudentStateOptions.find((s) => s.id === id)!);
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const title = t('modal.title');

  const description = t('modal.description');
  const options = StudentStateOptions;
  return (
    <Box>
      <EditIcon
        color="action"
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          setOpen(true);
        }}
      />
      <FadeModal
        setOpen={setOpen!}
        open={open!}
        width={500}
        padding={1}
        isDialog
      >
        <Box
          sx={{
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            padding: 1,
            pb: 5,
          }}
        >
          {/* <InfoIcon sx={{ fontSize: 125, margin: '0 auto' }} /> */}
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" gutterBottom>
              {customTitle || title}
            </Typography>
            {/* <Typography sx={{ color: '#666' }} variant="body1">
            {customDescription || description}
          </Typography> */}
            <GenericAutoCompleteComponent
              label=""
              options={options}
              value={studentState}
              onChange={setStudentState}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              marginTop: 5,
            }}
          >
            <Button
              sx={{ background: '#c1c1c1' }}
              variant="contained"
              color="warning"
              onClick={() => setOpen(false)}
            >
              {t('modal.cancel')}
            </Button>
            <Button
              sx={{ background: '#E24 ' }}
              variant="contained"
              color="error"
              onClick={() => handleAccept(studentState?.id!)}
            >
              {t('modal.confirm')}
            </Button>
          </Box>
        </Box>
      </FadeModal>
    </Box>
  );
}
