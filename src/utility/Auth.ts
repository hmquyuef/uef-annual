import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    sub?: string;
    name: string;
    email: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    family_name?: string;
}

export const getUserInfoFromToken = () => {
    const token = Cookies.get("s_t");
    if (!token) return { role: null, username: null, fullname: null, email: null, family_name: null };

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const role =
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            null;
        const username = decoded.sub || null;
        const fullname = decoded.name || null;
        const email = decoded.email || null;
        const family_name = decoded.family_name || null;

        return { role, username, fullname, email, family_name };
    } catch (error) {
        console.error("Lỗi giải mã token:", error);
        return { role: null, username: null, fullname: null, email: null, family_name: null };
    }
};