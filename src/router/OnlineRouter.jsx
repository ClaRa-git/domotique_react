import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import Home from "../screens/OnlineScreens/Home";
import Search from "../screens/OnlineScreens/Search";
import Account from "../screens/OnlineScreens/Account";
import InterfaceAi from "../screens/OnlineScreens/InterfaceAi";

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
            }
        ]
    }
]);

export default OnlineRouter;