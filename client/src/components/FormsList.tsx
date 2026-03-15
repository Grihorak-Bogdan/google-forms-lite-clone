import React from 'react';
import { useFetchForms } from '../hooks/useFetchForms';
import './FormList.css';
import '../App.css';
import { Link } from 'react-router-dom';
const FormsList = () => {
  const { forms, error, isLoading } = useFetchForms();
  if (isLoading) {
    return <div>Loading...</div>;
  }
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
            <ul className='forms-grid '> 
              {forms.map((form: { id: string; title: string }) => (
                <li key={form.id} className='form-item'>
                  <div className='font-family-sans-serif form-title'>
                    <Link className='form-link font-family-sans-serif' to={`/forms/${form.id}/fill`}>
                      {form.title}
                    </Link>
                  </div>
                  <div className='btn btn-responses font-family-sans-serif'>
                    <Link  to={`/forms/${form.id}/responses`}>
                      Responses
                    </Link>
                  </div>
                    
                  
                </li>
              ))}
            </ul>
          </div>
          
        </div>
        
    </div>
  );
};

export default FormsList;