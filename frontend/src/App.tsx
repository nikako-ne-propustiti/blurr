import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import {CreatePost, EditAccount, Login, RegisterAccount, Review, ViewFeed, ViewPost, ViewUserFeed} from './routes';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Navbar} from './wrapper';
import {Context} from './shared/Context';
import SubmissionIndicator, {SubmissionState} from './shared/SubmissionIndicator';
import {whoami} from './api';

const App: React.FC = () => {
    const [submissionState, setSubmissionState] = useState<SubmissionState>('submitting');
    const [indicatorText, setIndicatorText] = useState('');
    const {dispatch} = useContext(Context);
    useEffect(() => {
        (async () => {
            const response = await whoami();
            if (response.success) {
                dispatch({
                    type: 'log-in',
                    username: response.user
                });
                setSubmissionState('not-submitted');
            } else {
                setIndicatorText(response.error);
                setSubmissionState('error');
            }
        })();
    }, []);
    return <BrowserRouter>
        <div className="App">
            <Navbar />
            <main>
            {submissionState !== 'not-submitted' &&
                <SubmissionIndicator submissionState={submissionState} text={indicatorText} /> ||
                <Routes>
                    <Route path='/' element={<ViewFeed />} />
                    <Route path='/accounts/login' element={<Login />} />
                    <Route path='/accounts/register' element={<RegisterAccount />} />
                    <Route path='/accounts/edit' element={<EditAccount />} />
                    <Route path='/p/:post' element={<ViewPost />} />
                    <Route path='/p/new' element={<CreatePost />} />
                    <Route path='/p/review' element={<Review />} />
                    <Route path='/:username' element={<ViewUserFeed />} />
                </Routes>
            }
            </main>
            <footer>
                <p>Nikako Ne Propustiti &copy; {new Date().getFullYear()}</p>
                <p><a href="/terms-of-service.html" target="_blank">Terms of Service</a> &bull; <a href="/privacy-policy.html" target="_blank">Privacy Policy</a></p>
            </footer>
        </div>
    </BrowserRouter>;
}

export default App;
