import React from 'react';
import './App.css';
import {CreatePost, EditAccount, Login, RegisterAccount, Review, ViewFeed, ViewPost, ViewUserFeed} from './routes';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Navbar} from './wrapper';

const App: React.FC = () => {
    return <BrowserRouter>
        <div className="App">
            <Navbar />
            <main>
            <Routes>
                <Route path='/' element={<ViewFeed />} />
                <Route path='/accounts/login' element={<Login />} />
                <Route path='/accounts/register' element={<RegisterAccount />} />
                <Route path='/accounts/edit' element={<EditAccount />} />
                <Route path='/p/:postId' element={<ViewPost />} />
                <Route path='/p/new' element={<CreatePost />} />
                <Route path='/p/review' element={<Review />} />
                <Route path='/:username' element={<ViewUserFeed />} />
            </Routes>
            </main>
            <footer>
                <p>Nikako Ne Propustiti &copy; {new Date().getFullYear()}</p>
                <p><a href="/terms-of-service.html" target="_blank">Terms of Service</a> &bull; <a href="/privacy-policy.html" target="_blank">Privacy Policy</a></p>
            </footer>
        </div>
    </BrowserRouter>;
}

export default App;
