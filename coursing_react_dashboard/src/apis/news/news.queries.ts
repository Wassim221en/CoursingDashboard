import { useQuery } from '@tanstack/react-query';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import newsApis from './news.api';
import { IGetNews } from './news.interfaces';

const useNewsQuery = (payload: IPaginationParams & IGetNews) => {
  const queryResult = useQuery(['get-all-news', payload], () =>
    newsApis.getAllNews(payload),
  );

  return queryResult;
};

const useNewsDetails = (id: number) => {
  const queryResult = useQuery(['get-news-by-id', id], () =>
    newsApis.getNewsById(id),
  );

  return queryResult;
};

const newsQueries = {
  useNewsQuery,
  useNewsDetails,
};

export default newsQueries;
