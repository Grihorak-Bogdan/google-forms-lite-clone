import React from 'react';
import { useGetFormsQuery } from '../services/api';
import './FormList.css';
import '../App.css';

const FormsList = () => {
  // Викликаємо useGetFormsQuery без параметрів
  const { data, error, isLoading } = useGetFormsQuery();

  // Якщо дані ще завантажуються
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Якщо сталася помилка
  if (error) {
    return <div>Error loading forms</div>;
  }

  return (
    <div>
        <div className='section'>
            <a href="/forms/new" className="create-button font-family-sans-serif">Create New Form</a>
        </div>
        

        <div>

          <div className='header'>
            <h2 className='title'>Available Forms</h2>
          </div>
      
          <div className='section'>
            <ul className='forms-grid '> {/* Змінив назву класу для ясності */}
              {data?.map((form: { id: string; title: string }) => (
                <li key={form.id} className='form-item'>
                  <a href={`/forms/${form.id}/fill`} className='form-link font-family-sans-serif ' >
                    {form.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
        
    </div>
  );
};

export default FormsList;