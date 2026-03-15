import { useState } from 'react';
import { Question } from '../services/api';

export type Status = { type: 'success' | 'error'; text: string } | null;

export function useFormBuilder() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { id: 'q-1', text: '', type: 'TEXT', options: [] as string[] },
  ]);
  const [status, setStatus] = useState<Status>(null);

  const handleQuestionChange = (
    index: number,
    field: 'text' | 'type',
    value: string
  ) => {
    const newQuestions = [...questions];
    if (field === 'type' && (value === 'MULTIPLE_CHOICE' || value === 'CHECKBOX')) {
      const current = newQuestions[index];
      if (!current.options || current.options.length === 0) {
        newQuestions[index] = { ...current, type: value, options: [''] };
        setQuestions(newQuestions);
        return;
      }
    }
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    const nextId = `q-${questions.length + 1}`;
    setQuestions([
      ...questions,
      { id: nextId, text: '', type: 'TEXT', options: [] as string[] },
    ]);
  };

  const handleOptionChange = (index: number, value: string, optionIndex: number) => {
    const newQuestions = [...questions];
    const updatedOptions = [...newQuestions[index].options];
    updatedOptions[optionIndex] = value;
    newQuestions[index].options = updatedOptions;
    setQuestions(newQuestions);
  };

  const addOption = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    const updatedOptions = [...newQuestions[questionIndex].options];
    updatedOptions.splice(optionIndex, 1);
    newQuestions[questionIndex].options = updatedOptions;
    setQuestions(newQuestions);
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    setQuestions,
    status,
    setStatus,
    handleQuestionChange,
    addQuestion,
    handleOptionChange,
    addOption,
    removeOption,
  };
}
