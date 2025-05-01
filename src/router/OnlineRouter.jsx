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
import VibeDetail from "../screens/OnlineScreens/VibeDetail";
import PlanningDetail from "../screens/OnlineScreens/PlanningDetail";
import Information from "../screens/OnlineScreens/Account/Information";
import Password from "../screens/OnlineScreens/Account/Password";
import Setting from "../screens/OnlineScreens/Setting";

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
                path: "/account/informations",
                element: <Information />,
            },
            {
                path: "/account/password",
                element: <Password />,
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
                path: "/vibe/:id",
                element: <VibeDetail />
            },
            {
                path: "/setting",
                element: <Setting />
            },
            {
                path: "/planning",
                element: <Planning />
            },
            {
                path: "/planning/:id",
                element: <PlanningDetail />
            }
        ]
    }
]);

export default OnlineRouter;