import { useGetFormsQuery } from '../services/api';

export function useFetchForms() {
  const { data, error, isLoading } = useGetFormsQuery();
  return {
    forms: data || [],
    error,
    isLoading,
  };
}
