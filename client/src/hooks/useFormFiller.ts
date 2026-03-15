import { useState, useEffect } from 'react';
import { Answer, Question } from '../services/api';

export function useFormFiller(questions: Question[]) {
  const [answers, setAnswers] = useState<Answer[]>(
    questions.map((q: Question) => ({ questionId: q.id, answer: '' }))
  );

  useEffect(() => {
    setAnswers(questions.map((q: Question) => ({ questionId: q.id, answer: '' })));
  }, [questions]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev =>
      prev.map((ans: Answer) =>
        ans.questionId === questionId ? { ...ans, answer: value } : ans
      )
    );
  };

  return {
    answers,
    setAnswers,
    handleAnswerChange,
  };
}