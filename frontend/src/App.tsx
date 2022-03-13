import React from 'react';
import './App.css';
import {CreatePost, EditAccount, Login, RegisterAccount, ViewFeed, ViewPost, ViewUserFeed} from './routes';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Navbar} from './wrapper';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

const fetchContent = async () => {
  const response = await fetch(`${BACKEND_API_URL}/greetings/hello`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path='/' element={<ViewFeed />} />
            <Route path='/accounts/login' element={<Login />} />
            <Route path='/accounts/register' element={<RegisterAccount />} />
            <Route path='/accounts/edit' element={<EditAccount />} />
            <Route path='/p/:post' element={<ViewPost />} />
            <Route path='/p/new' element={<CreatePost />} />
            <Route path='/:username' element={<ViewUserFeed />} />
          </Routes>
        </main>
        <footer>Nikako Ne Propustiti &copy; {new Date().getFullYear()}</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
