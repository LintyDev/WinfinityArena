import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import {Home, Profile, ProfileAvatar, ErrorPage} from './pages/index'
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Shifumi from "./games/shifumi/Shifumi";

import PersistLogin from "./components/router/PersistLogin";
import RequireAuth from "./components/router/RequireAuth";
import AuthRouter from "./components/router/AuthRouter";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PERSISTLOGIN ROUTES */}
        <Route element={<PersistLogin />}>
          {/* Authenticated Routes */}
          <Route path="/auth/*" element={<AuthRouter />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          {/* App Routes */}
          <Route path="/*" element={<RequireAuth />}>
              <Route index element={<Home />} />
              <Route path="profile" >
                  <Route index element={<Profile />} />
                  <Route path='avatar' element={<ProfileAvatar />} />
              </Route>
              <Route path="shifumi" element={<Shifumi />} />
              <Route path='*' element={<ErrorPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
