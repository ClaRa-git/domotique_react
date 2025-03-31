import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext";
import { useEffect } from "react";
import { checkUser } from "../services/userService";

const useAuthCheck = (userInfo) => {
    const navigate = useNavigate();
    const { signOut } = useAuthContext();

    const verifyUser = () => {
        if(userInfo && userInfo.userId) {
            const isValidUser = checkUser(userInfo);
            // Si l'utilisateur n'est pas valide, on le déconnecte et on le redirige vers la page login
            if (!isValidUser) {
                signOut();
                navigate('/', { replace: true });
            }
        }
    }

    useEffect(() => {
        verifyUser();
    }, [userInfo, navigate]);
};

export default useAuthCheck;