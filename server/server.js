const express = require('express');
const cors = require('cors');
const path = require('path');
const { createHandler } = require('graphql-http/lib/use/express'); // Імпортуємо graphql-http
const { buildSchema } = require('graphql');

const app = express();

app.use(cors());

// Оголошуємо GraphQL схему
const schema = buildSchema(`
  enum QuestionType {
    TEXT
    MULTIPLE_CHOICE
    CHECKBOX
    DATE
  }

  input QuestionInput {
    id: ID
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
    id: ID
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
        id: q.id || String(index + 1),
      })),
    };
    forms.unshift(newForm);
    return newForm;
  },
  submitResponse: ({ formId, answers }) => {
    const newResponse = {
      id: String(responses.length + 1),
      formId,
      answers: answers.map((a, idx) => ({
        ...a,
        id: `${formId}-${idx + 1}`,
      })),
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
        id: q.id || String(index + 1),
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

app.all('/graphql', createHandler({
  schema: schema,
  rootValue: root,
}));


app.get('/gui', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GraphiQL</title>
      <link href="https://unpkg.com/graphiql@3.0.10/graphiql.min.css" rel="stylesheet" />
    </head>
    <body style="margin: 0;">
      <div id="graphiql" style="height: 100vh;"></div>
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      <script src="https://unpkg.com/graphiql@3.0.10/graphiql.min.js"></script>
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