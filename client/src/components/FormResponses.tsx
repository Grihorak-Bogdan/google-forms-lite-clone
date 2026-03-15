import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { useGetFormsQuery, Form } from '../services/api';
import { useFetchResponses } from '../hooks/useFetchResponses';
import './FormResponses.css';

const FormResponses = () => {
  const { id } = useParams(); 
  const { data: formsData, error: formError, isLoading: formLoading } = useGetFormsQuery();
  const { responses, error: responsesError, isLoading: responsesLoading } = useFetchResponses(id ?? '');

  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    if (formsData) {
      const foundForm = formsData.find((f) => f.id === id); 
      setForm(foundForm || null);
    }
  }, [formsData, id]);

  if (formLoading || responsesLoading) {
    return <div>Loading...</div>;
  }

  if (formError || !form) {
    return <div>Error loading form</div>;
  }

  if (responsesError) {
    return <div>Error loading responses</div>;
  }

  return (
    <div className='form-responses section'>
      <h2>Responses for {form.title}</h2>
      <table className='responses-table'>
        <thead>
          <tr>
            <th>Response ID</th>
            {form.questions.map((question) => (
              <th key={question.id}>{question.text}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response.id}>
              <td>{response.id}</td>
              {response.answers.map((answer, idx) => (
                <td key={idx}>{answer.answer}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormResponses;