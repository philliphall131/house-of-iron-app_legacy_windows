import apiHelpers from "./apiHelpers";
import axios from "axios";
import { Platform } from "react-native";

let BASE_URL;
// for development purposes, in production substitute with the single backend link
if (Platform.OS === 'web'){
    BASE_URL = "http://localhost:8000/api"
} else {
    BASE_URL = "https://rotten-rats-refuse-97-102-228-214.loca.lt/api";
}

const ironAPI = {}

ironAPI.login = async (loginData) => {
    return await apiHelpers.tryCatchFetch(() =>
        axios.post(`${BASE_URL}/login/`, loginData, apiHelpers.options())
    );
};

ironAPI.signup = async (signupData) => {
    return await apiHelpers.tryCatchFetch(() =>
        axios.post(`${BASE_URL}/users/`, signupData, apiHelpers.options())
    );
};

ironAPI.getUser = async (id, token) => {
    return await apiHelpers.tryCatchFetch(() =>
        axios.get(`${BASE_URL}/users/${id}`, apiHelpers.options(token))
    );
}

export default ironAPI