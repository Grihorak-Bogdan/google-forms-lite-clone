import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Визначаємо інтерфейси для ваших даних
interface Form {
  id: string;
  title: string;
  description: string;
}

interface GetFormsResponse {
  data: {
    forms: Form[];
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
  // Теги допомагають RTK Query знати, коли дані застаріли
  tagTypes: ['Forms'],
  endpoints: (builder) => ({
    
    // builder.query<ТипРезультату, ТипАргументу>
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
              }
            }
          `,
        },
      }),
      // Витягуємо масив форм з об'єкта GraphQL
      transformResponse: (response: GetFormsResponse) => response.data.forms,
      // Прив'язуємо цей запит до тега 'Forms'
      providesTags: ['Forms'],
    }),

    createForm: builder.mutation({
      query: ({ title, description, questions }) => ({
        url: '',
        method: 'POST',
        body: {
          // Використовуємо змінні (variables) замість підстановки рядків для безпеки
          query: `
            mutation CreateForm($title: String!, $description: String!, $questions: JSON!) {
              createForm(title: $title, description: $description, questions: $questions) {
                id
                title
              }
            }
          `,
          variables: { title, description, questions },
        },
      }),
      // Кажемо, що після цієї мутації список форм (тег 'Forms') треба оновити
      invalidatesTags: ['Forms'],
    }),
  }),
});

export const { useGetFormsQuery, useCreateFormMutation } = api;