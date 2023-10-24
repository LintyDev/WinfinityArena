import ProgressBar from '@ramonak/react-progress-bar'
import trophy from '../assets/trophy/trophy.png'
import useAuth from '../hooks/useAuth';


const ProfileStats = () => {
  const { auth } = useAuth();
  const pourcentXP = auth.XPUser.split(' / ');
  const avatar = import.meta.env.VITE_BASEURL + "/avatars/" + auth.userAvatar + ".jpg";
  return (
    <div className="profileStats">
      <div className="profileGame d-flex">
        <img
          alt=""
          src={avatar}
          width="70"
          height="70"
          className="profileAvatar d-inline-block align-top rounded-3"
        />{' '}
        <ul>
          <li><h3>{auth.username}</h3></li>
          <li>lvl {auth.LVLUser}</li>
        </ul>
      </div>
      <div className="profileXP">
        <ProgressBar
          completed={pourcentXP[0]}
          maxCompleted={parseInt(pourcentXP[1], 10)}
          height='3px'
          labelColor='#7dfc5a'
          bgColor='#7dfc5a'
          baseBgColor='#26264f'
        />
        <div className="d-flex justify-content-between">
          <span>Winfinity XP</span>
          <span>{auth.XPUser}</span>
        </div>
        <div className="mt-2">
          <span>Achievement :</span>
          <div className="profileTrophy">
            <img src={trophy} height="auto" width={45} />
            <img src={trophy} height="auto" width={45} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileStats