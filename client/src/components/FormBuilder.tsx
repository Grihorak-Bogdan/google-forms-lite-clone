import React, { useState } from 'react';
import { useCreateFormMutation } from '../services/api';

// Оголошення типу для питання
type Question = {
  text: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';
  options: string[]; // Масив для варіантів у питаннях типу "MULTIPLE_CHOICE" та "CHECKBOX"
  [key: string]: any;
};

const FormBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Ініціалізація questions з типом Question[]
  const [questions, setQuestions] = useState<Question[]>([{ text: '', type: 'TEXT', options: [] }]);

  const [createForm] = useCreateFormMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createForm({ title, description, questions }).unwrap();
      alert('Form created successfully!');
    } catch (err) {
      console.error('Failed to create form: ', err);
      alert('Error creating form');
    }
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value; // Оновлюємо відповідне поле питання
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'TEXT', options: [] }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Form Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Form Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {questions.map((question, index) => (
        <div key={index}>
          <div>
            <label>Question</label>
            <input
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
          {question.type === 'MULTIPLE_CHOICE' && (
            <div>
              <label>Options (comma separated)</label>
              <input
                type="text"
                value={question.options.join(', ')}
                onChange={(e) => handleQuestionChange(index, 'options', e.target.value.split(','))}
              />
            </div>
          )}
        </div>
      ))}

      <button type="button" onClick={addQuestion}>
        Add Question
      </button>
      <button type="submit">Create Form</button>
    </form>
  );
};

export default FormBuilder;