import React from 'react';
import { BrowserRouter as Router, Routes, Route , Link} from 'react-router-dom';
import FormBuilder from './components/FormBuilder';
import FormsList from './components/FormsList';
import FormFiller from './components/FormFiller';
import FormResponses from './components/FormResponses';
import './App.css';
import './base.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo font-family-sans-serif">
                Google Forms Lite
            </Link>
            {/* <Link to="/" className="nav-logo">
                add accont icon here
            </Link> */}
          </div>
        </nav>
      
      
        <main className='main_content'>
          <Routes>
            <Route path="/" element={<FormsList />} />
            <Route path="/forms/new" element={<FormBuilder />} />
            <Route path="/forms/:id/fill" element={<FormFiller />} /> 
            <Route path="/forms/:id/responses" element={<FormResponses />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;