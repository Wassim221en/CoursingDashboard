import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import adsApis from './ads.api';
import { IGetAds } from './ads.interfaces';

const useAdsInfiniteQuery = (payload: IGetAds) => {
  const queryResult = useInfiniteQuery(
    ['get-infinite-video-sections', payload],
    async ({ pageParam = 0 }) => {
      const result = await adsApis.getAllAds({
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

const useAdsDetails = (id: number) => {
  const queryResult = useQuery(['get-ads-by-id', id], () =>
    adsApis.getAdsById(id),
  );

  return queryResult;
};

const adsQueries = {
  useAdsInfiniteQuery,
  useAdsDetails,
};

export default adsQueries;
