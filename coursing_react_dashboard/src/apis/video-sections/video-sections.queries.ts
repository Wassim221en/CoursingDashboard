import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import videoSectionsApi from './video-sections.apis';
import { IGetVideoSectionsPayload } from './video-sections.interface';

const useVideoSectionsInfiniteQuery = (payload: IGetVideoSectionsPayload) => {
  const queryResult = useInfiniteQuery(
    ['get-infinite-video-sections'],
    async ({ pageParam = 0 }) => {
      const result = await videoSectionsApi.getAllVideoSections({
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
      enabled: !!payload.videoId,
    },
  );
  return queryResult;
};

const useVideoSectionDetailsQuery = (id: number) => {
  const queryResult = useQuery(
    ['get-videoSection-by-id', id],
    () => videoSectionsApi.getVideoSectionById(id),
    {
      enabled: !!id,
      cacheTime: 0,
    },
  );
  return queryResult;
};

const useVideoSectionQuery = (payload: IGetVideoSectionsPayload) => {
  const queryResult = useQuery(['get-all-video-section', payload], () =>
    videoSectionsApi.getAllVideoSections(payload),
  );

  return queryResult;
};

const videoSectionsQueries = {
  useVideoSectionQuery,
  useVideoSectionDetailsQuery,
  useVideoSectionsInfiniteQuery,
};

export default videoSectionsQueries;
