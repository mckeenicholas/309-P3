import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Calendars from './pages/Calendars'

const App = () => {
 return (
  <BrowserRouter>
  <Routes>
    <Route index element={<Home />}/>
      <Route path="accounts/">
        <Route path="login" element={<Login />}/>
      </Route>
      <Route path="dashboard/">
        <Route path="calendars/:calendar" element={<Calendars />}/>
      </Route>
  </Routes>
  </BrowserRouter>
 )
}

export default App;
