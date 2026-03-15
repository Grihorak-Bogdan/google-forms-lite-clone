import React from 'react';
import { useCreateFormMutation } from '../services/api';
import { useFormBuilder } from '../hooks/useFormBuilder';
import { useNotification } from '../hooks/useNotification';
import './FormBuilder.css';
import './FormFiller.css';
import '../App.css';


const FormBuilder = () => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    handleQuestionChange,
    addQuestion,
    handleOptionChange,
    addOption,
    removeOption,
  } = useFormBuilder();
  const [createForm] = useCreateFormMutation();
  const { notification, showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payloadQuestions = questions.map(({ type, text, options }) => ({
      type,
      text,
      options,
    }));
    try {
      await createForm({ title, description, questions: payloadQuestions }).unwrap();
      showNotification('success', 'Form created successfully!');
    } catch (err) {
      console.error('Failed to create form: ', err);
      showNotification('error', 'Error creating form');
    }
  };

  return (
    <form className='form-filler font-family-sans-serif form-filler-font' onSubmit={handleSubmit}>
      {notification && (
        <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {notification.text}
        </div>
      )}
      <div>
        <label>Form Title</label>
        <input className='form-input'
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div >
        <label>Form Description</label>
        <textarea className='form-input'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {questions.map((question, index) => (
        <div  className='section-form-create' key={index}>
          <div>
            <label>Question</label>
            <input className='form-input'
              type="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
              required
            />
          </div>
          <div>
            <label>Question Type</label>
            <select
              value={question.type}
              onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
            >
              <option value="TEXT">Text</option>
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="CHECKBOX">Checkbox</option>
              <option value="DATE">Date</option>
            </select>
          </div>
          {(question.type === 'MULTIPLE_CHOICE' || question.type === 'CHECKBOX') && (
            <div className='options-section'>
              <label>Options</label>
              {question.options.map((option, optionIndex) => (
                <div className='option-row' key={optionIndex}>
                  <input 
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value, optionIndex)}
                    required
                  />
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => removeOption(index, optionIndex)}
                    disabled={question.options.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button className="btn" type="button" onClick={() => addOption(index)}>
                Add Option
              </button>
            </div>
          )}
        </div>
      ))}

      
      <div className='btn-section'>

        <button className="btn" type="button" onClick={addQuestion}>
          Add Question
        </button>
        <button className="btn" type="submit">Create Form</button>
      </div>
      
    </form>
  );
};

export default FormBuilder;