import { useQuery } from '@tanstack/react-query';
import salesPointtApi from './sales-point.api';
import {
  IGetSalesPointPayload,
  IPointsForSalePointPayload,
} from './sales-point.interfaces';

const useSalesPointQuery = (payload?: IGetSalesPointPayload) => {
  const queryResult = useQuery(['get-sales-points', payload], () =>
    salesPointtApi.getAllSalesPoints(payload),
  );
  return queryResult;
};

const useSalesPointDetailsQuery = (salesPointId: number) => {
  const queryResult = useQuery(
    ['get-sales-point-by-id', salesPointId],
    () => salesPointtApi.getSalesPointById(salesPointId),
    {
      enabled: !!salesPointId,
    },
  );
  return queryResult;
};

const usePointsForSalesPointQuery = (payload: IPointsForSalePointPayload) => {
  const queryResult = useQuery(['get-points-for-sale-poit', payload], () =>
    salesPointtApi.getPointsforSalesPoints(payload),
  );

  return queryResult;
};

const salesPointQueries = {
  useSalesPointQuery,
  useSalesPointDetailsQuery,
  usePointsForSalesPointQuery,
};

export default salesPointQueries;
