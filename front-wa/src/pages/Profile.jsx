import { useEffect, useRef, useState } from "react";
import { Form, Tab, Tabs } from "react-bootstrap";
import usePrivateAxios from "../hooks/usePrivateAxios";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const privateAxios = usePrivateAxios();
  const { setAuth } = useAuth();
  //Username
  const [newUsername, setNewUsername] = useState('');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [matchNewPwd, setMatchNewPwd] = useState('');
  const [errorMsgUsername, setErrorMsgUsername] = useState('');
  const [errorMsgPwd, setErrorMsgPwd] = useState('');
  const [validReq, setValidReq] = useState('');
  const [validReqPwd, setValidReqPwd] = useState('');
  const errRefUsername = useRef(null);

  const errRefPwd = useRef(null);

  const handleSubmitUsername = async (e) => {
    e.preventDefault();
    setValidReq('');
    try {
      const username = newUsername;
      const response = await privateAxios.post('/profile/username', JSON.stringify({ username }));
      setNewUsername('');
      setAuth(prev => ({ ...prev, username: response.data.newUsername }));
      setValidReq('Pseudonyme enregistré avec succès !');
    } catch (err) {
      if (err?.response.status === 400) {
        setErrorMsgUsername('Pseudonyme non valide !');
      } else if (err?.response.status === 409) {
        setErrorMsgUsername('Le pseudonyme est déjà pris, veuillez en choisir un autre.');
      } else if (err?.response.status === 500) {
        setErrorMsgUsername('Le serveur ne réponds pas, veuillez réessayer plus tard.');
      } else {
        setErrorMsgUsername('Une erreur est survenue, veuillez réessayer.');
      }
    }
  };

  const handleSubmitPwd = async (e) => {
    e.preventDefault();
    try {
        await privateAxios.post('/profile/changepass', JSON.stringify({oldPwd, newPwd, matchNewPwd}));
        setNewPwd('');
        setOldPwd('');
        setMatchNewPwd('');
        setValidReqPwd('Mot de passe enregistré avec succès !');
    } catch (err) {
      if(err?.response.status === 400){
        setErrorMsgUsername('Mot de passe non valide !');
      } else if (err?.response.status === 401) {
        setErrorMsgPwd('Veuillez saisir le même mot de passe');
      } else if (err?.response.status === 500) {
        setErrorMsgPwd('Une erreur est survenue, veuillez réesssayer !')
      } else if (err?.response.status === 409) {
        setErrorMsgPwd('Mot de passe actuel incorrecte !');
      }
    }
  };


  useEffect(() => {
    setErrorMsgUsername('');

  }, [newUsername]);
  useEffect(() => {
    setErrorMsgPwd('');
  }, [oldPwd, newPwd, matchNewPwd]);

  return (
    <div className="myAccount">
      <p>
        Bienvenue sur votre page de profil ! Ici, vous avez la possibilité de
        mettre à jour votre pseudo ainsi que votre mot de passe. Pour garantir
        la sécurité de votre compte, veillez à choisir un mot de passe fort et
        unique.
      </p>
      <p className="dangerMessage">
        ⚠️ Avertissement : Jamais vous ne devriez partager votre mot de passe
        avec quiconque, même si cette personne prétend être un membre de notre
        équipe. Protégez toujours vos informations personnelles.
      </p>
      <Tabs
        defaultActiveKey="profile"
        className="mb-3"
        fill
      >
        <Tab eventKey="username" title="Pseudonyme">
          <Form onSubmit={(e) => { handleSubmitUsername(e) }}>
            <p className={validReq ? "successmsg" : "offscreen"} aria-live="assertive">{validReq}</p>
            <p ref={errRefUsername} className={errorMsgUsername ? "errmsg" : "offscreen"} aria-live="assertive">{errorMsgUsername}</p>
            <Form.Control
              type="text"
              placeholder="Entrer un nouveau Pseudonyme"
              onChange={(e) => { setNewUsername(e.target.value) }}
              required
            />
            <p className="inputNotes text-start">
              2 à 25 caractères. <br /> Les caractères spéciaux ne sont pas
              acceptés.
            </p>
            <button type='submit' className="btnW green mt-2 float-end">Enregistrer</button>
          </Form>
        </Tab>
        <Tab eventKey="password" title="Mot de passe">
          <Form onSubmit={(e) => { handleSubmitPwd(e) }}>
            <p className={validReqPwd ? "successmsg" : "offscreen"} aria-live="assertive">{validReqPwd}</p>
            <p ref={errRefPwd} className={errorMsgPwd ? "errmsg" : "offscreen"} aria-live="assertive">{errorMsgPwd}</p>
            <Form.Control
              type="password"
              placeholder="Tapez votre mot de passe actuel"
              onChange={(e) => { setOldPwd(e.target.value) }}
              required
            />
            <p className="inputNotes text-start">
              Vous devez saisir votre mot de passe actuel.
            </p>
            <Form.Control
              className="mt-3"
              type="password"
              placeholder="Tapez votre nouveau mot de passe"
              onChange={(e) => { setNewPwd(e.target.value) }}
              required
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
            <Form.Control
              className="mt-3"
              type="password"
              placeholder="Retapez votre nouveau mot de passe"
              onChange={(e) => { setMatchNewPwd(e.target.value) }}
              required
            />
            <p className="inputNotes text-start">
              Vous devez saisir le même mot de passe.
            </p>
            <button type='submit' className="btnW green mt-2 float-end">Enregistrer</button>
          </Form>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profile;
