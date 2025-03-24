import { useEffect, useRef, useState } from "react";

const useNotifications = (url: string) => {
    const [isNews, setIsNews] = useState(true);
    const socketRef = useRef<WebSocket | null>(null);

    const cleanup = () => {
        if (socketRef.current) {
            socketRef.current.onclose = null;
            socketRef.current.onmessage = null;
            socketRef.current.onerror = null;
            socketRef.current.close();
        }
    };

    const connectWebSocket = () => {
        cleanup();
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            console.log("✅ Notifications connected!");
        };

        socketRef.current.onmessage = (event) => {
            if (event.data === "true") {
                setIsNews(true);
            }
        };

        socketRef.current.onclose = () => {
            console.log("❌ WebSocket disconnected!");
            setIsNews(false);
            cleanup();
        };

        socketRef.current.onerror = (error) => {
            console.error("⚠ WebSocket error:", error);
        };
    };

    useEffect(() => {
        connectWebSocket();
        return cleanup;
    }, [url]);

    useEffect(() => {
        if (isNews) setTimeout(() => setIsNews(false), 200);
    }, [isNews]);

    return { isNews };
};

export default useNotifications;
