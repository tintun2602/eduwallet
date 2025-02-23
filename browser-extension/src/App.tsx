import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';
import LoginPage from './pages/LoginPageComponent';
import Homepage from './pages/HomePageComponent';
import StudentPage from './pages/StudentPageComponent';
import University from './models/university';
import CoursePage from './pages/CoursePageComponent';
import AuthenticationProvider from './providers/AuthenticationProvider';
import PrivateRoute from './components/PrivateRoute';

import { ntnu, polito } from './db';


/**
 * The main application component that sets up routing and authentication.
 * @author Diego Da Giau
 * @returns {JSX.Element} The rendered component. 
 * @remarks
 * This component uses the `AuthenticationProvider` to wrap the routes and ensure that
 * authentication is handled. The routes include:
 * - `/login` for the login page
 * - `/wallet` for the homepage, which displays the list of universities
 * - `/student` for the student page
 * - `/wallet/:code` for the course page
 */
function App(): JSX.Element {
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    const unis = [
      new University(polito.id, polito.name, polito.shortName),
      new University(ntnu.id, ntnu.name, ntnu.shortName)
    ];
    setUniversities(unis.sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  return (
    <AuthenticationProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/wallet" element={<Homepage universities={universities} />} />
          <Route path='/student' element={<StudentPage />} />
          <Route path='/wallet/:code' element={<CoursePage />} />
        </Route>
      </Routes>
    </AuthenticationProvider>
  );
}

export default App
