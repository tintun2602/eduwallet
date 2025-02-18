import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPageComponent';
import Homepage from './pages/HomePageComponent';
import { User } from './models/user';
import Layout from './components/LayoutComponent';
import UserPage from './pages/UserPageComponent';


import { ntnu, polito, student, results } from './db';
import University from './models/university';
import { Outlet, Navigate } from 'react-router-dom';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const [universities, setUniversities] = useState<University[]>([]);
  //const [menuOption, setMenuOption] = useState<number>(1);

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

  const ProtectedRoute = () => {
    return isLoggedIn && user ? <Layout><Outlet /></Layout> : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={user && <Homepage user={user} universities={universities} />} />
      </Route>
      <Route path='/user' element={<ProtectedRoute />}>
        <Route index element={user && <UserPage user={user} />} />
      </Route>
    </Routes>
  );
}

export default App
