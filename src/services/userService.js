import axios from "axios";

/**
 * méthode qui vérifie que l'utilisateur du localStorage est bien celui de la bdd
 * @params [object] userInfo - l'utilisateur du localStorage
 * @returns {boolean} - true si l'utilisateur est valide, false sinon
 */
export const checkUser = async (userInfo) => {
    try {
        // récupération de l'utilisateur dans la bdd avec l'id qui est dans le localStorage
        const response = await axios.get(`${API_URL}/users/${userInfo.userId}`);
        const user = response.data;
        // vérification que l'utilisateur du localStorage est bien celui de la bdd
        if (user.nickname === userInfo.nickname) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log(`Erreur sur le checkUser : ${error}`);
        return false;
    }
}