import { useEffect, useRef, useState } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const effectRan = useRef(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;
        if (effectRan.current === true) {
            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                } catch (err) {
                    if(!error){
                        setError(err);
                    }
                    
                } finally {
                    isMounted && setIsLoading(false);
                }
            }
            !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
        }
        return () => {
            isMounted = false;
            effectRan.current = true;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        {isLoading ? <p>Loading ...</p> : <Outlet />}
        </>
    )
}

export default PersistLogin;