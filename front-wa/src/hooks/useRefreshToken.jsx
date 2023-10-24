import { privateAxios } from "../api/axios";
import useAuth from "./useAuth";


const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await privateAxios.get('/refresh');
        const accessToken = response.data.accessToken;
        const username = response.data.usernameUser;
        const XPUser = response.data.XPUser;
        const LVLUser = response.data.LVLUser;
        const userAvatar = response?.data.userAvatar;
        setAuth({username, XPUser, LVLUser, accessToken, userAvatar});
        return accessToken;
    }
    return refresh;
}

export default useRefreshToken
