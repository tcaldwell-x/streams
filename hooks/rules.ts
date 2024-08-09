import { useMemo } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routes } from '@/constants/routes';

export function useRulesManagement() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const response = await axios.get(routes.rules, {
        withCredentials: true
      });
      return response.data.data;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: true
  });

  const addRuleMutation = useMutation({
    mutationFn: async ({ value, tag }) => {
      const response = await axios.post(routes.rules, { value, tag }, {
        withCredentials: true
      });
      return response.data;
    },
    onSuccess: () => {
      // Refetch rules list to update UI with new data
      queryClient.invalidateQueries(['rules']);
    }
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (ids) => {
      const response = await axios.delete(routes.rules, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: { ids }
      });
      return response.data;
    },
    onSuccess: () => {
      // Refetch rules list to update UI with new data after deletion
      queryClient.invalidateQueries(['rules']);
    }
  });

  const addRule = (value, tag) => {
    addRuleMutation.mutate({ value, tag });
  };

  const deleteRule = (ids) => {
    deleteRuleMutation.mutate(ids);
  };

  return useMemo(() => ({
    rules: data,
    isLoadingRules: isLoading,
    isFetchingRules: isFetching,
    rulesError: error,
    refetchRules: refetch,
    addRule,
    isAddingRule: addRuleMutation.isLoading,
    addRuleError: addRuleMutation.isError,
    addRuleSuccess: addRuleMutation.isSuccess,
    addRuleData: addRuleMutation.data,
    deleteRule,
    isDeletingRule: deleteRuleMutation.isLoading,
    deleteRuleError: deleteRuleMutation.isError,
    deleteRuleSuccess: deleteRuleMutation.isSuccess,
    deleteRuleData: deleteRuleMutation.data,
  }), [data, isLoading, isFetching, error, refetch, addRuleMutation, deleteRuleMutation]);
}
