import { useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import usePrivateAxios from "../hooks/usePrivateAxios";
import { Link } from "react-router-dom";

const ProfileAvatar = () => {
    const privateAxios = usePrivateAxios();
    const { setAuth, auth } = useAuth();
    const avatarRef = useRef(null);
    const [avatar, setAvatar] = useState(import.meta.env.VITE_BASEURL + "/avatars/" + auth.userAvatar + ".jpg");
    const [newAvatar, setNewAvatar] = useState('');
    const avatars = [
        'avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6', 'avatar7', 'avatar8',
        'avatar9', 'avatar10', 'avatar11', 'avatar12'
    ];
    const [validChange, setValidChange] = useState('');
    const [errChange, setErrChange] = useState('');

    const handleAvatar = async (e) => {
        e.preventDefault();
        try {
            setErrChange('');
            setValidChange('');
            await privateAxios.post('/profile/avatar', JSON.stringify({newAvatar}));
            avatarRef.current.style.display = 'none';
            setNewAvatar('');
            setAuth(prev => ({ ...prev, userAvatar: newAvatar}));
            setValidChange('Avatar enregistré avec succès !');
        } catch (error) {
            console.log(error)
            if(error?.response.status === 400) {
                setErrChange('Une erreur est survenue !')
            } else if (error?.response.status === 500){
                setErrChange('Server no response');
            } else {
                setErrChange('Le serveur ne réponds pas, veuillez réessayer plus tard.')
            }
        }
    }

    const handleChoose = (e, image) => {
        e.preventDefault();
        setErrChange('');
        setValidChange('');
        setNewAvatar(image);
        setAvatar(import.meta.env.VITE_BASEURL + "/avatars/" + image + ".jpg");
        avatarRef.current.style.display = 'block';
    };
    return (
        <div className="chooseAvatar">
            <div className="goBackAvatar">
                <Link to="/profile" className="nav-link">&#8701; Retour</Link>
            </div>
            <div className="currentAvatar text-center mt-5">
                <img
                    alt=""
                    src={avatar}
                    width="200"
                    height="auto"
                    className="profileAvatar d-inline-block align-top rounded-3"
                />
                <div className="mt-3">
                    <p className={validChange ? 'successmsg' : 'offscreen'} aria-live="assertive">{validChange}</p>
                    <p className={errChange ? 'errmsg' : 'offscreen'} aria-live="assertive">{errChange}</p>
                </div>
                <div ref={avatarRef} className="mt-2" style={{display: 'none'}}>
                    <button onClick={(e) => {handleAvatar(e)}} className="btnW green"> Enregistrer</button>
                </div>
                <p className="mt-2">
                    Bienvenue sur la page de modification de votre avatar ! Ici, vous avez
                    la possibilité de personnaliser votre apparence sur notre plateforme.
                    Choisissez parmi une sélection d&apos;avatars prédéfinis by{" "}
                    <a href="https://www.facebook.com/moshimoshicatalyst" target="blank">
                        Catalyst Labs</a>.
                </p>
            </div>
            <div className="allAvatar">
                {avatars.map((item, index) => {
                    const avatarShow = import.meta.env.VITE_BASEURL + "/avatars/" + item + ".jpg";
                    return (
                        <img
                            key={index}
                            alt=""
                            src={avatarShow}
                            width="200"
                            height="auto"
                            className="profileAvatar d-inline-block align-top rounded-3"
                            onClick={(e) => { handleChoose(e, item)}}
                        />
                    )
                })}
            </div>
        </div>
    );
};

export default ProfileAvatar;
