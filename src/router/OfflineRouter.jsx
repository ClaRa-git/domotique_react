import { createBrowserRouter } from "react-router-dom";
import HomeOffline from "../screens/OfflineScreens/HomeOffline";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import Login from "../screens/OfflineScreens/Login";

const OfflineRouter = createBrowserRouter([
    {
        element: <HomeOffline />, // élément qui sera retourné sur toutes les vues
        errorElement: <ErrorPage />, // élément qui sera retourné en cas d'erreur
        children: [
            {
                path: "/",
                element: <Login />, 
            }
        ]
    }
]);

export default OfflineRouter;