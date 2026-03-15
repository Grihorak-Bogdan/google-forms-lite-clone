import { useGetResponsesQuery } from '../services/api';

export function useFetchResponses(formId: string) {
  const { data, error, isLoading } = useGetResponsesQuery(formId);
  return {
    responses: data || [],
    error,
    isLoading,
  };
}
