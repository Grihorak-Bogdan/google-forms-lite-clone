import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetFormsQuery, useSubmitResponseMutation, Form, Answer } from '../services/api';
import { useFormFiller } from '../hooks/useFormFiller';
import { useNotification } from '../hooks/useNotification';
import './FormFiller.css';


const FormFiller = () => {
  const { id } = useParams(); 
  const { data, error, isLoading } = useGetFormsQuery();
  const [submitResponse] = useSubmitResponseMutation();

  const [form, setForm] = useState<Form | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { answers, setAnswers, handleAnswerChange } = useFormFiller(form?.questions || []);
  const { notification, showNotification } = useNotification();

  useEffect(() => {
    if (data) {
      const foundForm = data.find((f: Form) => f.id === id); 
      setForm(foundForm || null);
    }
  }, [data, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !form) {
    return <div>Error loading form</div>;
  }

  const validateForm = () => {
    if (!form) return false;

    const nextErrors: Record<string, string> = {};

    form.questions.forEach((q) => {
      const answerObj = answers.find(ans => ans.questionId === q.id);
      const value = answerObj?.answer ?? '';
      if (q.type === 'CHECKBOX') {
        const selected = value.split(',').filter(Boolean);
        if (!selected.length) {
          nextErrors[q.id] = 'Please select at least one option.';
        }
      } else {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          nextErrors[q.id] = 'This field is required.';
        }
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !form) return;

    if (!validateForm()) {
      return;
    }

    const payload: Answer[] = form.questions.map((q) => {
      const answerObj = answers.find(ans => ans.questionId === q.id);
      return {
        questionId: q.id,
        answer: answerObj?.answer ?? '',
      };
    });

    try {
      await submitResponse({ formId: id, answers: payload }).unwrap();
      setAnswers(form.questions.map(q => ({ questionId: q.id, answer: '' })));
      setErrors({});
      showNotification('success', 'Form submitted successfully!');
    } catch (err) {
      console.error('Failed to submit response:', err);
      showNotification('error', 'Error submitting response');
    }
  };

  return (
    <div className='form-filler  font-family-sans-serif form-filler-font'>
      <h2> {form.title}</h2>
      {notification && (
        <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {notification.text}
        </div>
      )}
      <form className='form-board ' onSubmit={handleSubmit}>
        {form.questions.map((question) => (
          <div key={question.id}>
            <label>{question.text}</label>

            {question.type === 'TEXT' && (
              <input
                type="text"
                className={`form-input ${errors[question.id] ? 'error' : ''}`}
                value={answers.find(ans => ans.questionId === question.id)?.answer || ''}
                onChange={(e) => {
                  handleAnswerChange(question.id, e.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next[question.id];
                    return next;
                  });
                }}
              />
            )}

            {question.type === 'DATE' && (
              <input
                type="date"
                className={`form-input ${errors[question.id] ? 'error' : ''}`}
                value={answers.find(ans => ans.questionId === question.id)?.answer || ''}
                onChange={(e) => {
                  handleAnswerChange(question.id, e.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next[question.id];
                    return next;
                  });
                }}
              />
            )}

            {question.type === 'MULTIPLE_CHOICE' && (
              <div className='question-group'>
                {question.options.map((option) => (
                  <div key={option} className='question-option'>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers.find(ans => ans.questionId === question.id)?.answer === option}
                        onChange={(e) => {
                          handleAnswerChange(question.id, e.target.value);
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next[question.id];
                            return next;
                          });
                        }}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'CHECKBOX' && (
              <div className='question-group'>
                {question.options.map((option) => {
                  const answerObj = answers.find(ans => ans.questionId === question.id);
                  const selected = (answerObj?.answer || '')
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const checked = selected.includes(option);
                  return (
                    <div key={option} className='question-option'>
                      <label>
                        <input
                          type="checkbox"
                          name={`question-${question.id}`}
                          value={option}
                          checked={checked}
                          onChange={(e) => {
                            const next = new Set(selected);
                            if (e.target.checked) next.add(option);
                            else next.delete(option);
                            handleAnswerChange(question.id, Array.from(next).join(','));
                            setErrors((prev) => {
                              const nextErr = { ...prev };
                              delete nextErr[question.id];
                              return nextErr;
                            });
                          }}
                        />
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            {errors[question.id] && (
              <div className='field-error'>{errors[question.id]}</div>
            )}
          </div>
        ))}
        <button className='btn' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormFiller;