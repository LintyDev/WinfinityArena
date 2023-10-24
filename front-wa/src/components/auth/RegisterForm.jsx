import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import publicAxios from '../../api/axios';
import crossIcon from "../../assets/icons/cross.svg";
import checkIcon from "../../assets/icons/check.svg";

// REGEX
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,24}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,254}$/;

const RegisterForm = () => {
  const usernameRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [validUsername, setValidUsername] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [validPwdMatch, setValidPwdMatch] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registerData, setRegisterData] = useState({
    username: "",
    pwd: "",
    matchPwd: "",
  });
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(registerData.username));
  }, [registerData.username]);
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(registerData.pwd));
    setValidPwdMatch(registerData.pwd === registerData.matchPwd);
  }, [registerData.pwd, registerData.matchPwd]);
  useEffect(() => {
    setErrorMsg('')
  }, [registerData.username, registerData.pwd, registerData.matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await publicAxios.post('/auth/register', registerData,
      {
        headers: {'Content-Type': 'application/json'},
        withCredentials: true
      });
      navigate("/auth/login");
    }catch(err) {
      if(err.response?.status === 500){
        setErrorMsg('Le serveur ne répond pas, veuillez reéssayer plus tard.')
      } else if(err.response?.status === 400) {
        setErrorMsg('Mmhh mhh vaut mieux s\'arrêter là!');
      } else if (err.response?.status === 409) {
        setErrorMsg('Ce pseudonyme est déjà utilisé !');
      } else {
        setErrorMsg('Une erreur est survenue, veuillez réeassayer !');
      }
    }
  }

  return (
    <div className="LoginForm d-flex flex-column text-center">
      <div className="loginInput text-center">
        <Form onSubmit={handleSubmit}>
          <div>
            <h3>Inscription</h3>
            <hr />
            <p ref={errRef} className={errorMsg ? 'errmsg' : 'offscreen' } aria-live="assertive">{errorMsg}</p>
            <Form.Control
              type="text"
              placeholder="Pseudonyme"
              ref={usernameRef}
              required
              onChange={(e) => {
                setRegisterData({ ...registerData, username: e.target.value });
              }}
            />
            <div className="d-flex mb-2 align-items-center">
              <img
                src={validUsername ? checkIcon : crossIcon}
                className={validUsername ? 'validInput' : "notValidInput"}
                width="24"
                height="24"
              />
              <p className="inputNotes text-start">
                2 à 25 caractères. <br /> Les caractères spéciaux ne sont pas
                acceptés.
              </p>
            </div>
            <Form.Control
              type="password"
              placeholder="Mot de passe"
              required
              onChange={(e) => {
                setRegisterData({ ...registerData, pwd: e.target.value });
              }}
            />
            <div className="d-flex mb-2 align-items-center">
              <img
                src={validPwd ? checkIcon : crossIcon}
                className={validPwd ? 'validInput' : "notValidInput"}
                width="24"
                height="24"
              />
              <p className="inputNotes text-start">
                Votre mot de passe doit contenir au moins:
                <br /> une lettre majuscule et minuscule, un chiffre et un
                caractère spécial. <br />
                Les caractères spéciaux autorisés:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>.
              </p>
            </div>
            <Form.Control
              type="password"
              placeholder="Retapez votre mot de passe"
              required
              onChange={(e) => {setRegisterData({...registerData, matchPwd: e.target.value})}}
            />
            <div className="d-flex mb-2 align-items-center">
              <img
                src={validPwdMatch && registerData.matchPwd !== '' ? checkIcon : crossIcon}
                className={validPwdMatch && registerData.matchPwd !== '' ? 'validInput' : "notValidInput"}
                width="24"
                height="24"
              />
              <p className="inputNotes text-start">
                Vous devez saisir le même mot de passe.
              </p>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <p>
              Vous avez déjà compte ? <a href="/auth/login">Se connecter</a>
            </p>
            <button disabled={!validUsername || !validPwd || !validPwdMatch ? true : false} type="submit" className="btnW green">
              S&apos;inscrire
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
