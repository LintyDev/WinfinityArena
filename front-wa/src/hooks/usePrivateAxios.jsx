import { useEffect } from "react";
import { privateAxios } from "../api/axios";
import useAuth from './useAuth';
import useRefreshToken from './useRefreshToken';

const usePrivateAxios = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {

    const requestInterceptor = privateAxios.interceptors.request.use(
        config => {
            if(!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
            }
            return config;
        }, (error) => Promise.reject(error)
    );
    const responseInterceptor = privateAxios.interceptors.response.use(
        response => response,
        async (error) => {
            const prevRequest = error?.config;
            if(error?.response?.status === 403 && !prevRequest.sent) {
                prevRequest.sent = true;
                const newAccessToken = await refresh();
                prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return privateAxios(prevRequest);
            }
            return Promise.reject(error);
        } 
    );

    return () => {
        privateAxios.interceptors.request.eject(requestInterceptor);
        privateAxios.interceptors.response.eject(responseInterceptor);
    }
  }, [auth, refresh])

  return privateAxios;

}

export default usePrivateAxios;