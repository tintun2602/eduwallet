import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPageComponent';
import Homepage from './pages/HomePageComponent';
import { User } from './models/user';
import UserPage from './pages/UserPageComponent';
import University from './models/university';
import CoursePage from './pages/CoursePageComponent';


import { ntnu, polito, student, results } from './db';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const userTemp: User = new User(student.id, student.name, student.surname, student.birthDate, student.birthPlace, student.country);
    userTemp.setResults(results);
    setUser(userTemp);
    const unis: University[] = [
      new University(polito.id, polito.name, polito.shortName),
      new University(ntnu.id, ntnu.name, ntnu.shortName)
    ];
    setUniversities(unis.sort((a, b) => a.getName().localeCompare(b.getName())));
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/wallet" element={
        user && isLoggedIn ? <Homepage universities={universities} user={user} /> : <LoginPage />
      } />
      <Route path='/user' element={
        user && isLoggedIn ? <UserPage user={user} /> : <LoginPage />
      } />
      <Route path='/wallet/:code' element={
        user && isLoggedIn ? <CoursePage /> : <LoginPage />
      } />
    </Routes>
  );
}

export default App
