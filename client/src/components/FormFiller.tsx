// src/components/FormFiller.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Для отримання id форми з URL
import { useGetFormsQuery, Form } from '../services/api'; // Для отримання форми з сервера
import './FormFiller.css'; 


const FormFiller = () => {
  const { id } = useParams(); // Отримуємо id форми з URL
  const { data, error, isLoading } = useGetFormsQuery();

  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    if (data) {
      const foundForm = data.find((f: Form) => f.id === id); // Шукаємо форму за id
      setForm(foundForm || null);
    }
  }, [data, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !form) {
    return <div>Error loading form</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Логіка для відправки відповіді на сервер
    alert('Form submitted successfully!');
  };

  return (
    <div className='form-filler section font-family-sans-serif form-filler-font'>
      <h2> {form.title}</h2>
      <form className='form-board ' onSubmit={handleSubmit}>
        {form.questions.map((question, index) => (
          <div key={question.id}>
            <label >{question.text}</label>
            {question.type === 'TEXT' && <input type="text" className='form-input' />}
            {question.type === 'MULTIPLE_CHOICE' && (
              <div>
                {question.options.map((option, idx) => (
                  <div key={idx}>
                    <input type="radio" name={`question-${index}`} value={option} />
                    {option}
                  </div>
                ))}
              </div>
            )}
            {question.type === 'CHECKBOX' && (
              <div>
                {question.options.map((option, idx) => (
                  <div key={idx}>
                    <input type="checkbox" name={`question-${index}`} value={option} />
                    {option}
                  </div>
                ))}
              </div>
            )}
            {question.type === 'DATE' && <input type="date" />}
          </div>
        ))}
        <button className='btn' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormFiller;