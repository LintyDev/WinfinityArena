import { createContext, useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

const SocketContext = createContext({});

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const effectRan = useRef(false);
    

    useEffect(() => {
        if (effectRan.current === true) {
            const newSocket = io(import.meta.env.VITE_API_BASEURL);
            setSocket(newSocket);
            return () => newSocket.close();
        }
        
        return () => {
            effectRan.current = true;
        }
        
    }, []);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}
SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SocketContext;