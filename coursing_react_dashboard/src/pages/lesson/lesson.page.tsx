import lessonApi from 'apis/lesson/lesson.api';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import lessonQueries from 'apis/lesson/lesson.queries';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import NoData from 'components/common/no-data/no-data.component';
import PageContainer from 'components/common/page-container/page-container.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { showError, showSuccess } from 'libs/react.toastify';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfiniteListWrapper } from '@craft-code/react-helper-utils';
import { Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import routesNames from 'routes/constants';
import SortableList, { SortableItem } from '@reyhappen/react-easy-sort';
import LessonCard from './components/lesson-card.component';

function LessonsPage() {
  const navigate = useNavigate();
  const { pathname = '' } = useLocation();

  const courseId = useSearchParams('course');

  const actionPath = `${pathname}/action`;

  const { t } = useTranslation();
  const {
    dispatchDeleting,
    dispatchResetCrudState,
    isDeleting,
    getActionId,
    isEditing,
  } = useCreateCrudState<ILesson>();

  const handleAddClick = useCallback(() => {
    navigate(`${actionPath}?course=${courseId}`);
  }, [actionPath, courseId, navigate]);

  const handleEditClick = useCallback(
    (data: ILesson) => {
      navigate(`${actionPath}?course=${courseId}&lesson=${data.id}`);
    },
    [actionPath, courseId, navigate],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const handleAddVideoSectionsClick = useCallback(
    (id: number) => {
      navigate(`${routesNames.videoSections}?video=${id}`);
    },
    [navigate],
  );

  const lessonsResult = lessonQueries.useLessonsInfiniteQuery({
    courseId: courseId || 0,
    pageNumber: 0,
    pageSize: 6,
  });

  const [orderedLessons, setOrderedLessons] = useState<ILesson[]>([]);

  useEffect(
    () =>
      setOrderedLessons(
        (lessonsResult.data?.pages ?? []).flatMap((page) => page.data.data),
      ),
    [lessonsResult.data?.pages],
  );

  const handleRemoveLesson = async () => {
    try {
      await lessonApi.removeLesson(getActionId());
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
      await lessonsResult.refetch();
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const handleOrderChange = async (oldIdx: number, newIdx: number) => {
    const start = Math.min(oldIdx, newIdx);
    const end = Math.max(oldIdx, newIdx);
    const desc = oldIdx > newIdx;

    const target = orderedLessons[oldIdx];

    const effectedItems = orderedLessons.slice(
      desc ? start : start + 1,
      desc ? end : end + 1,
    );

    const orderList = effectedItems.map((i) => i.order).concat(target.order);
    const targetNewOrder = desc
      ? Math.max(...orderList)
      : Math.min(...orderList);
    setOrderedLessons((prev) => {
      const newArray = [...prev];
      newArray.splice(desc ? end : start, 1);
      newArray.splice(desc ? start : end, 0, target);
      return newArray;
    });

    try {
      await lessonApi.updateLessonOrder(target.id, targetNewOrder);
      await Promise.all([
        ...effectedItems.map((item) =>
          lessonApi.updateLessonOrder(
            item.id,
            desc ? item.order - 1 : item.order + 1,
          ),
        ),
      ]).catch(() => {
        lessonsResult
          .refetch()
          .then(({ data }) =>
            setOrderedLessons(
              data?.pages.flatMap((item) => item.data.data) ?? [],
            ),
          );
      });
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error) {
      console.error(error);
      showError(t('common.somethingWentWrong'));
    }
    lessonsResult.refetch();
  };

  return (
    <PageContainer
      title={String(t('exams.lessons'))}
      name={String(t('exams.lesson'))}
      handleAddClick={handleAddClick}
      actionModalTitle={isEditing ? 'Edit lesson' : 'Add lesson'}
      handleDeleteSubmit={handleRemoveLesson}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      permissionName="forceAllow"
    >
      <SortableList onSortEnd={handleOrderChange}>
        <Grid container spacing={4}>
          <InfiniteListWrapper
            infiniteQueryResult={lessonsResult}
            loadingComponent={<LoadingPlaceholder />}
            noDataOverride={
              !lessonsResult.isLoading &&
              !lessonsResult.data?.pages[0].data.data.length
            }
            noDataComponent={<NoData />}
          >
            {() =>
              orderedLessons.map((lesson) => (
                <SortableItem key={lesson.id}>
                  <Grid item md={4}>
                    <LessonCard
                      handleEditClick={handleEditClick}
                      handleRemoveClick={handleRemoveClick}
                      handleAddClick={handleAddVideoSectionsClick}
                      item={lesson}
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

export default LessonsPage;
