import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    sub?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    family_name?: string;
}

/**
 * Lấy thông tin người dùng từ JWT token
 * @returns { role: string | null, userName: string | null }
 */
export const getUserInfoFromToken = () => {
    const token = Cookies.get("s_t");
    if (!token) return { role: null, userName: null, family_name: null };

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const role =
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            null;
        const userName = decoded.sub || null;
        const family_name = decoded.family_name || null;

        return { role, userName, family_name };
    } catch (error) {
        console.error("Lỗi giải mã token:", error);
        return { role: null, userName: null, family_name: null };
    }
};