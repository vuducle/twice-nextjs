import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/twice";
// TODO: fix it
export const registerOnce = async (form: {
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
    bias: string;
}) => {
    return await axios.post(`${API_URL}`, form, { withCredentials: true });
};



// works
export const loginOnce = async (data: { username: string; password: string }) => {
    return await axios.post(`${API_URL}/login`, data, {withCredentials: true})
}
// works
export const getMe = async() => {
    return await axios.get(`${API_URL}/me`, {withCredentials: true});
}
// works
export const logoutOnce = async () => {
    try {
        await axios.post(`${API_URL}/logout`, {}, {
            withCredentials: true
        });
        // delete cookie blink-reveluv-once
        document.cookie = "blink-reveluv-once-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";

    } catch (error) {
        console.error("Logout fehlgeschlagen:", error);
    }
};
//works
export const getUserInfo = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/v1/twice/user/me", {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user info:", error);
        return { profilePic: "/images/twice-default.jpg" };
    }
};