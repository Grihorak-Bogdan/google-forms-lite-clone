import React, { useState } from 'react';
import { useCreateFormMutation, Question } from '../services/api'; // Використовуємо мутацію для створення форми
import './FormBuilder.css';
import './FormFiller.css';
import '../App.css';

const FormBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { id: 'q-1', text: '', type: 'TEXT', options: [] as string[] },
  ]);
  const [createForm] = useCreateFormMutation(); // Викликаємо мутацію для створення форми

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payloadQuestions = questions.map(({ type, text, options }) => ({
      type,
      text,
      options,
    }));

    try {
      await createForm({ title, description, questions: payloadQuestions }).unwrap(); // Створюємо форму
      alert('Form created successfully!');
    } catch (err) {
      console.error('Failed to create form: ', err);
      alert('Error creating form');
    }
  };

  const handleQuestionChange = (
    index: number,
    field: 'text' | 'type',
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    const nextId = `q-${questions.length + 1}`;
    setQuestions([
      ...questions,
      { id: nextId, text: '', type: 'TEXT', options: [] as string[] },
    ]); // Додаємо нове питання
  };

  const handleOptionChange = (index: number, value: string, optionIndex: number) => {
    const newQuestions = [...questions];
    const updatedOptions = [...newQuestions[index].options];
    updatedOptions[optionIndex] = value; // Оновлюємо конкретний варіант
    newQuestions[index].options = updatedOptions; // Заміщаємо старі варіанти новими
    setQuestions(newQuestions);
  };

  const addOption = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push(''); // Додаємо порожній варіант
    setQuestions(newQuestions);
  };

  return (
    <form className='form-filler section font-family-sans-serif form-filler-font' onSubmit={handleSubmit}>
      <div>
        <label>Form Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Form Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
              <label>Options</label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value, optionIndex)}
                    required
                  />
                </div>
              ))}
              <button className="btn"  type="button" onClick={() => addOption(index)}>
                Add Option
              </button>
            </div>
          )}
          {question.type === 'CHECKBOX' && (
            <div>
              <label>Options</label>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value, optionIndex)}
                    required
                  />
                </div>
              ))}
              <button className="btn"type="button" onClick={() => addOption(index)}>
                Add Option
              </button>
            </div>
          )}
        </div>
      ))}

      <button className="btn" type="button" onClick={addQuestion}>
        Add Question
      </button>
      <button className="btn" type="submit">Create Form</button>
    </form>
  );
};

export default FormBuilder;