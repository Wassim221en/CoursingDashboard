import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import attachmentsApi from './attachments.api';
import { IAttachments } from './attachments.interfaces';

const useAttachmentInfiniteQuery = (
  payload: IAttachments & IPaginationParams,
) => {
  const queryResult = useInfiniteQuery(
    ['get-attachments'],
    async ({ pageParam = 0 }) => {
      const result = await attachmentsApi.GetAttachments({
        ...payload,
        pageNumber: pageParam,
      });
      return {
        data: result,
        pageParam: pageParam + 1,
      };
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.data.hasNextPage) return undefined;
        return lastPage.pageParam;
      },
      refetchOnMount: 'always',
    },
  );
  return queryResult;
};

const useAttachmentsQuery = (
  payload: IAttachments & IPaginationParams,
  disabled?: boolean,
) => {
  const queryResult = useQuery(
    ['get-attachments', payload],
    () => attachmentsApi.GetAttachments(payload),
    {
      enabled: !disabled,
    },
  );
  return queryResult;
};

const attachmentsQueries = {
  useAttachmentsQuery,
  useAttachmentInfiniteQuery,
};

export default attachmentsQueries;
