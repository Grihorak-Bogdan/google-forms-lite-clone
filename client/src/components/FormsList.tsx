import React from 'react';
import { useGetFormsQuery } from '../services/api';

const FormsList = () => {
  // Викликаємо useGetFormsQuery без параметрів або з порожнім об'єктом
  const { data, error, isLoading } = useGetFormsQuery(undefined);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading forms</div>;
  }

  return (
    <div>
      <h2>Available Forms</h2>
      <ul>
        {data?.map((form: { id: string; title: string }) => (
          <li key={form.id}>
            <a href={`/forms/${form.id}/fill`}>{form.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormsList;