import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPageComponent';
import Homepage from './pages/HomePageComponent';
import UserPage from './pages/UserPageComponent';
import University from './models/university';
import CoursePage from './pages/CoursePageComponent';


import { ntnu, polito } from './db';
import AuthenticationProvider from './providers/AuthenticationProvider';
import PrivateRoute from './components/PrivateRoute';



function App() {
  const [universities, setUniversities] = useState<University[]>([]);


  useEffect(() => {
    const unis: University[] = [
      new University(polito.id, polito.name, polito.shortName),
      new University(ntnu.id, ntnu.name, ntnu.shortName)
    ];
    setUniversities(unis.sort((a, b) => a.getName().localeCompare(b.getName())));
  }, []);

  return (
    <AuthenticationProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/wallet" element={<Homepage universities={universities} />} />
          <Route path='/user' element={<UserPage />} />
          <Route path='/wallet/:code' element={<CoursePage />} />
        </Route>
      </Routes>
    </AuthenticationProvider>
  );
}

export default App
