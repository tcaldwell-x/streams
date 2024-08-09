import { useMemo } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { routes } from '@/constants/routes';

export function useStreams() {

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['streams'],
    queryFn: async () => {
      const response = await axios.get(routes.streams, {
        withCredentials: true
      });
      return response.data.data;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: true
  });

  return useMemo(() => ({
    streams: data,
    isLoadingStreams: isLoading,
    isFetchingStreams: isFetching,
    streamsError: error,
    refetchStreams: refetch,
  }), [data, isLoading, isFetching, error, refetch]);
}
