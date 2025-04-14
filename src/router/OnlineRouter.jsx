import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import Home from "../screens/OnlineScreens/Home";
import Search from "../screens/OnlineScreens/Search";
import Account from "../screens/OnlineScreens/Account";
import InterfaceAi from "../screens/OnlineScreens/InterfaceAi";
import Playlist from "../screens/OnlineScreens/Playlist";
import Room from "../screens/OnlineScreens/Room";
import Vibe from "../screens/OnlineScreens/Vibe";
import Planning from "../screens/OnlineScreens/Planning";
import PlaylistDetail from "../screens/OnlineScreens/PlaylistDetail";
import RoomDetail from "../screens/OnlineScreens/RoomDetail";

const OnlineRouter = createBrowserRouter([
    {
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/search",
                element: <Search />,
            },
            {
                path: "/ai",
                element: <InterfaceAi />,
            },
            {
                path: "/account/:id",
                element: <Account />,
            },
            {
                path: "/playlist",
                element: <Playlist />,
            },
            {
                path: "/playlist/:id",
                element: <PlaylistDetail />,
            },
            {
                path: "/room",
                element: <Room />
            },
            {
                path: "/room/:id",
                element: <RoomDetail />
            },
            {
                path: "/vibe",
                element: <Vibe />
            },
            {
                path: "/planning",
                element: <Planning />
            }
        ]
    }
]);

export default OnlineRouter;