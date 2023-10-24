import { Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import publicAxios from "../../api/axios";
import logoWinfinity from "../../assets/img/Winfinity2.png";


const LoginForm = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate()
  const usernameRef = useRef();
  const errRef = useRef();
  const [errorMsg, setErrorMsg] = useState('');
  const [loginData, setLoginData] = useState({
    username: "",
    pwd: "",
  });

  useEffect(() => {
    usernameRef.current.focus();
  }, []);
  useEffect(() => {
    setErrorMsg('');
  }, [loginData.username, loginData.pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await publicAxios.post('/auth/login', loginData,
      {
        headers: {"Content-Type" : 'application/json'},
        withCredentials: true
      });
      const accessToken = response?.data.accessToken;
      const username = response?.data.usernameUser;
      const XPUser = response?.data.XPUser;
      const LVLUser = response?.data.LVLUser;
      const userAvatar = response?.data.userAvatar;
      setLoginData({username: "", pwd: ""});
      // Context and Navigate 
      setAuth({username, XPUser, LVLUser, accessToken, userAvatar});
      navigate('/');
    }catch(err) {
      if(err?.response.status === 500) {
        setErrorMsg('Le serveur ne répond pas, veuillez réessayer plus tard.')
      } else {
        setErrorMsg('Pseudonyme ou mot de passe invalide !')
      }
    }
  }

  return (
    <div className="LoginForm d-flex flex-column text-center">
      <div className="loginLogo">
        <img src={logoWinfinity} height="300" width="auto" />
        <h4>
          Bienvenue sur Winfinity<span style={{ color: "#8181ff" }}>Arena</span>
        </h4>
      </div>
      <div className="loginInput text-center">
        <Form onSubmit={handleSubmit}>
          <div>
            <h3>Connexion</h3>
            <p ref={errRef} className={errorMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errorMsg}</p>
            <Form.Control
              ref={usernameRef}
              type="text"
              placeholder="Pseudonyme"
              onChange={(e) => {
                setLoginData({ ...loginData, username: e.target.value });
              }}
              required
            />
            <Form.Control
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => {
                setLoginData({ ...loginData, pwd: e.target.value });
              }}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <p>
              Vous n&apos;avez pas de compte ?{" "}
              <a href="/auth/register">S&apos;inscrire</a>
            </p>
            <button type="submit" className="btnW green">
              Entrer dans le monde
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
