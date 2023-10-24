import useAuth from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { NavBar, ProfileStats, LiveChat, GameHistory, Footer } from "../../components";
import { SocketProvider } from "../../context/SocketProvider";

const RequireAuth = () => {
    const { auth } = useAuth();

    return auth?.accessToken ? (
        <SocketProvider>
            <main className="App">
                <NavBar />
                <div className="content">
                    <section className="leftArena">
                        <ProfileStats />
                        <GameHistory />
                        <Footer />
                    </section>
                    <section className="mainContent">
                        <Outlet />
                    </section>
                    <LiveChat />
                </div>
            </main>
        </SocketProvider>
    ) : (
        <Navigate to="/auth/login" replace />
    );
};
export default RequireAuth;
