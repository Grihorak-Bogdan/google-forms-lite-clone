import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Question {
  id: string;
  type: string;
  text: string;
  options: string[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface GetFormsResponse {
  data: {
    forms: Form[];
  };
}

export interface Answer {
  questionId: string;
  answer: string;
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
}

interface GetResponsesResponse {
  data: {
    responses: Response[];
  };
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/graphql',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  
  tagTypes: ['Forms', 'Responses'],
  endpoints: (builder) => ({
    
    getForms: builder.query<Form[], void>({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              forms {
                id
                title
                description
                questions {
                  id
                  type
                  text
                  options
                }
              }
            }
          `,
        },
      }),
      
      transformResponse: (response: GetFormsResponse) => response.data.forms,
      
      providesTags: ['Forms'],
    }),

    getResponses: builder.query<Response[], string>({
      query: (formId) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query GetResponses($formId: ID!) {
              responses(formId: $formId) {
                id
                formId
                answers {
                  questionId
                  answer
                }
              }
            }
          `,
          variables: { formId },
        },
      }),
      transformResponse: (response: GetResponsesResponse) => response.data.responses,
      providesTags: (result, error, formId) => [{ type: 'Responses', id: formId }],
    }),

    submitResponse: builder.mutation<
      { submitResponse: Response },
      { formId: string; answers: Answer[] }
    >({
      query: ({ formId, answers }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            mutation SubmitResponse($formId: ID!, $answers: [AnswerInput]) {
              submitResponse(formId: $formId, answers: $answers) {
                id
                formId
                answers {
                  questionId
                  answer
                }
              }
            }
          `,
          variables: { formId, answers },
        },
      }),
      invalidatesTags: (result, error, { formId }) => [{ type: 'Responses', id: formId }],
    }),

    createForm: builder.mutation<
      { createForm: { id: string; title: string } },
      { title: string; description: string; questions: Array<{ type: string; text: string; options: string[] }> }
    >({
      query: ({ title, description, questions }) => ({
        url: '',
        method: 'POST',
        body: {
          
          query: `
            mutation CreateForm($title: String!, $description: String, $questions: [QuestionInput]) {
              createForm(title: $title, description: $description, questions: $questions) {
                id
                title
              }
            }
          `,
          variables: { title, description, questions },
        },
      }),
      
      invalidatesTags: ['Forms'],
    }),
  }),
});

export const { useGetFormsQuery, useGetResponsesQuery, useCreateFormMutation, useSubmitResponseMutation } = api;