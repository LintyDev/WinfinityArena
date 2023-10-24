import { Container, Navbar, Nav, Offcanvas } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { privateAxios } from "../api/axios";
import ProfileStats from "./ProfileStats";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";

import logo from '../assets/img/logo.png';
import usersIcon from '../assets/icons/users.svg';



const NavBar = () => {
  const { auth, setAuth } = useAuth();
  const { socket } = useSocket();
  const [showProfile, setShowProfile] = useState(false);
  const handleShowProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);
  const [usersConnected, setUsersConnected] = useState(0);
  const navigate = useNavigate();
  const avatar = import.meta.env.VITE_BASEURL + "/avatars/" + auth.userAvatar + ".jpg";

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await privateAxios.get('/auth/logout');
      setAuth({});
    } catch (err) {
      if (err) {
        alert('Une erreur est survenur lors de la déconnexion, veuillez réeassyer !');
      }
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on('users_count', (usersCount) => {
        setUsersConnected(usersCount);
      });
    }
    return () => {
      if (socket) {
        socket.off('users_count');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" className="bg-body-tertiary" style={{ gridColumn: '1/-1' }}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            WinfinityArena
          </Navbar.Brand>
          <Nav className="me-auto" id="mobileHide">
            <Link to="/" className="nav-link">HOME</Link>
            <Link to="/" className="nav-link">CLASSEMENTS</Link>
            <Link to="/shifumi" className="nav-link">COFFRES</Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <div className="usersOnline d-flex align-items-center">
              <img
                alt=""
                src={usersIcon}
                width="24"
                height="24"
                className="colorIcon d-inline-block align-top"
              />{' '}
              <span>{usersConnected}</span>
            </div>
            <div className="separator"></div>
            <div className="profile d-flex">
              <div className="avatarXP">
                <img
                  alt=""
                  src={avatar}
                  width="46"
                  height="46"
                  className="d-inline-block align-top rounded-5"
                />{' '}
                <span className="currentXP">{auth.LVLUser}</span>
              </div>
              <div>
                <ul className="">
                  <li className="profileShow" onClick={handleShowProfile}> {auth.username} &rsaquo;</li>
                  <li className="statusUser">Online</li>
                </ul>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={showProfile} onHide={handleCloseProfile} className="profileCanvas">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title> Winfinity Safe Zone</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="profileCanvasContent">
            <div className="profileCanvasContentTop">
              <ProfileStats />
            </div>
            <div className="profileCanvasContentBody">
              <button className="btnW w-100 mt-3" disabled>Classements</button>
              <button className="btnW w-100 mt-3" disabled>Coffres</button>
              <button className="btnW w-100 mt-3" disabled>Mes statistiques</button>
              <button 
                className="btnW orange w-100 mt-5"
                onClick={(e) => {e.preventDefault(); navigate('/profile/avatar'); handleCloseProfile();}}>
                  Modifier l&apos;avatar
              </button>
              <button
                className="btnW orange w-100 mt-3"
                onClick={(e) => { e.preventDefault(); navigate('/profile'); handleCloseProfile(); }}>
                  Modifier le profil
              </button>
            </div>
            <div className="profileCanvasContentFooter">
              <button onClick={(e) => { handleLogout(e) }} className="btnW red">Déconnexion</button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default NavBar;