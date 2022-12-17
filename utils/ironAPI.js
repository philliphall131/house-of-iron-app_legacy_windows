import apiHelpers from "./apiHelpers";
import axios from "axios";

let BASE_URL = "http://192.168.1.183:8000/api";

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
    axios.get(`${BASE_URL}/users/${id}/`, apiHelpers.options(token)));
}

export default ironAPI