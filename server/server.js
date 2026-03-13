const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');


const app = express();


// 1. СПОЧАТКУ ОГОЛОШУЄМО СХЕМУ
const schema = buildSchema(`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  input QuestionInput {
    type: QuestionType
    text: String
    options: [String]
  }

  input AnswerInput {
    questionId: ID
    answer: String
  }

  type Question {
    id: ID
    type: QuestionType
    text: String
    options: [String]
  }

  type Answer {
    questionId: ID
    answer: String
  }

  type Response {
    id: ID
    formId: ID
    answers: [Answer]
  }

  type Form {
    id: ID
    title: String
    description: String
    questions: [Question]
  }

  type Query {
    forms: [Form]
    form(id: ID!): Form
    responses(formId: ID!): [Response]
  }

  type Mutation {
    createForm(title: String!, description: String, questions: [QuestionInput]): Form
    submitResponse(formId: ID!, answers: [AnswerInput]): Response
    updateForm(id: ID!, title: String, description: String, questions: [QuestionInput]): Form  
    deleteForm(id: ID!): Form  
  }
`);

// 2. ДАНІ ТА ЛОГІКА (ROOT)
let forms = [];
let responses = [];

const root = {
  forms: () => forms,
  form: ({ id }) => forms.find(f => f.id === id),
  responses: ({ formId }) => responses.filter(r => r.formId === formId),

  createForm: ({ title, description, questions }) => {
    const newForm = {
      id: String(forms.length + 1),
      title,
      description,
      questions: (questions || []).map((q, index) => ({
        ...q,
        id: String(index + 1),
      })),
    };
    forms.push(newForm);
    return newForm;
  },

  submitResponse: ({ formId, answers }) => {
    const newResponse = {
      id: String(responses.length + 1),
      formId,
      answers,
    };
    responses.push(newResponse);
    return newResponse;
  },
  updateForm: ({ id, title, description, questions }) => {
    const form = forms.find(f => f.id === id);
    if (!form) {
      throw new Error('Form not found');
    }
    form.title = title || form.title;
    form.description = description || form.description;
    if (questions) {
      form.questions = questions.map((q, index) => ({
        ...q,
        id: String(index + 1),
      }));
    }
    return form;
  },

  deleteForm: ({ id }) => {
    const index = forms.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('Form not found');
    }
    const [deletedForm] = forms.splice(index, 1);
    return deletedForm;
  },
};

// 3. ПІДКЛЮЧАЄМО ОБРОБНИК (ПІСЛЯ ТОГО ЯК SCHEMA ТА ROOT ВИЗНАЧЕНІ)
app.all('/graphql', createHandler({
  schema: schema,
  rootValue: root,
}));

// Допоміжний інтерфейс для тестування
app.get('/gui', (req, res) => {
  res.send(`
    <html>
      <head><title>GraphiQL</title><link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" /></head>
      <body style="margin: 0;"><div id="graphiql" style="height: 100vh;"></div>
        <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/graphiql/graphiql.min.js"></script>
        <script>
          const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
          ReactDOM.render(React.createElement(GraphiQL, { fetcher }), document.getElementById('graphiql'));
        </script>
      </body>
    </html>
  `);
});

app.listen(4000, () => {
  console.log('🚀 Server: http://localhost:4000/graphql');
  console.log('📊 GUI: http://localhost:4000/gui');
});