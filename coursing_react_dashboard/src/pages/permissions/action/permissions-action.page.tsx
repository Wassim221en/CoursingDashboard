import { Box, Button } from '@mui/material';
import permissionsQueries from 'apis/permissions/permissions.queries';
import {
  IPermission,
  IPermissionspayload,
  IWebContents,
} from 'apis/permissions/permissions.interfaces';
import { useEffect, useState } from 'react';
import PageTitle from 'components/common/generic-table-page/components/page-title/page-title.component';
import { useTranslation } from 'react-i18next';
import { HashLoader } from 'react-spinners';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import PermissionsApis from 'apis/permissions/permissions.api';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { showSuccess } from 'libs/react.toastify';
import { useNavigate } from 'react-router-dom';
import PermissionsListItem from '../components/permissions-list.component';
import PermissionsNestedListItem from '../components/permissions-nested-list.component';

function ActionPremissions() {
  const roleId = useSearchParams('role');

  const navigate = useNavigate();

  const [webContent, setWebContent] = useState<IPermission>({
    base: [],
    schooling: { base: [], setting: [] },
    setting: [],
    specialty: { base: [], setting: [] },
    university: { base: [], setting: [] },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation();

  const {
    data: webContentData,
    isLoading: isLoadingWebContent,
    refetch,
  } = permissionsQueries.useWebContentsForRoleQueries(roleId);

  useEffect(() => {
    if (webContentData?.webContentsForDashboardRole.permissions)
      setWebContent(webContentData.webContentsForDashboardRole.permissions);
  }, [webContentData]);

  const handleChangeBaseWebItem = (newItem: IWebContents) => {
    const temp = structuredClone(webContent?.base);
    const index = webContent?.base.findIndex((w) => w.id === newItem.id);
    temp[index] = newItem;
    setWebContent((prev) => ({
      ...prev,
      base: temp,
    }));
  };
  const handleChangeUniversityWebItem = (newItem: IWebContents) => {
    const temp = structuredClone(webContent?.university.base);
    const index = webContent?.university.base.findIndex(
      (w) => w.id === newItem.id,
    );
    temp[index] = newItem;
    setWebContent((prev) => ({
      ...prev,
      university: {
        base: temp,
        setting: [...prev.university.setting],
      },
    }));
  };
  const handleChangeUniversitySettingWebItem = (newItem: IWebContents) => {
    const temp = structuredClone(webContent?.university.setting);
    const index = webContent?.university.setting.findIndex(
      (w) => w.id === newItem.id,
    );
    temp[index] = newItem;
    setWebContent((prev) => ({
      ...prev,
      university: {
        base: [...prev.university.base],
        setting: temp,
      },
    }));
  };

  const handleChangeSchoolWebItem = (newItem: IWebContents) => {
    const temp = structuredClone(webContent?.schooling.base);
    const index = webContent?.schooling.base.findIndex(
      (w) => w.id === newItem.id,
    );
    temp[index] = newItem;
    setWebContent((prev) => ({
      ...prev,
      schooling: {
        base: temp,
        setting: [...prev.schooling.setting],
      },
    }));
  };
  const handleChangeSchoolSettingsWebItem = (newItem: IWebContents) => {
    const temp = structuredClone(webContent?.schooling.setting);
    const index = webContent?.schooling.setting.findIndex(
      (w) => w.id === newItem.id,
    );
    temp[index] = newItem;
    setWebContent((prev) => ({
      ...prev,
      schooling: {
        base: [...prev.schooling.base],
        setting: temp,
      },
    }));
  };
  const handleChangeSpecalityWebItem = (newItem: IWebContents) => {
    const temp = structuredClone(webContent?.specialty.base);
    const index = webContent?.specialty.base.findIndex(
      (w) => w.id === newItem.id,
    );
    temp[index] = newItem;
    setWebContent((prev) => ({
      ...prev,
      specialty: {
        base: temp,
        setting: [...prev.specialty.setting],
      },
    }));
  };
  const handleChangeSpecalitySettingsWebItem = (newItem: IWebContents) => {
    const temp = structuredClone(webContent?.specialty.setting);
    const index = webContent?.specialty.setting.findIndex(
      (w) => w.id === newItem.id,
    );
    temp[index] = newItem;
    setWebContent((prev) => ({
      ...prev,
      specialty: {
        base: [...prev.specialty.base],
        setting: temp,
      },
    }));
  };
  const handleChangeGlobalSettingsWebItem = (newItem: IWebContents) => {
    const temp = structuredClone(webContent?.setting);
    const index = webContent?.setting.findIndex((w) => w.id === newItem.id);
    temp[index] = newItem;
    setWebContent((prev) => ({
      ...prev,
      setting: temp,
    }));
  };

  const handleActionPermissions = async () => {
    setIsSubmitting(true);
    const Payload: IPermissionspayload = {
      roleId,
      permissions: webContent,
    };
    try {
      await PermissionsApis.actionPermissions(Payload);
      showSuccess(t('common.dataUpdatedSuccessfully'));
      refetch();
      setIsSubmitting(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setIsSubmitting(false);
    }
  };

  if (!roleId) navigate(-1);

  return (
    <Box sx={{ py: 2 }}>
      <PageTitle title={webContentData?.roleName || ''} />
      {isLoadingWebContent ? (
        <LoadingPlaceholder />
      ) : (
        <>
          <Box
            sx={{
              width: '70%',
              height: '70vh',
              border: 1,
              px: 2,
              py: 2,
              overflow: 'scroll',
              borderRadius: 2,
              borderColor: 'silver',
            }}
          >
            {webContent?.base?.map((b) => (
              <Box
                sx={{ my: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}
                key={b.id}
              >
                <PermissionsListItem
                  item={b}
                  changeWebItem={handleChangeBaseWebItem}
                />
              </Box>
            ))}
            <Box sx={{ my: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <PermissionsNestedListItem
                listName="University"
                base={webContent?.university.base}
                settings={webContent?.university.setting}
                changeWebBaseItem={handleChangeUniversityWebItem}
                changeWebSettingItem={handleChangeUniversitySettingWebItem}
              />
            </Box>
            <Box sx={{ my: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <PermissionsNestedListItem
                listName="Schooling"
                base={webContent?.schooling.base}
                settings={webContent?.schooling.setting}
                changeWebBaseItem={handleChangeSchoolWebItem}
                changeWebSettingItem={handleChangeSchoolSettingsWebItem}
              />
            </Box>
            <Box sx={{ my: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <PermissionsNestedListItem
                listName="Speciality"
                base={webContent?.specialty.base}
                settings={webContent?.specialty.setting}
                changeWebBaseItem={handleChangeSpecalityWebItem}
                changeWebSettingItem={handleChangeSpecalitySettingsWebItem}
              />
            </Box>
            <Box sx={{ my: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <PermissionsNestedListItem
                listName="Global Settings"
                base={webContent?.setting}
                changeWebBaseItem={handleChangeGlobalSettingsWebItem}
                changeWebSettingItem={handleChangeUniversityWebItem}
              />
            </Box>
          </Box>
          <Box my={2}>
            <Button
              sx={{ width: '75px' }}
              variant="contained"
              type="submit"
              onClick={handleActionPermissions}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <HashLoader color="#808080" size={20} />
              ) : (
                t('common.submit')
              )}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default ActionPremissions;
