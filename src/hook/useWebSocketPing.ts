import { useEffect, useRef, useState } from "react";

const useWebSocketPing = (url: string, interval = 5000, timeout = 5000) => {
    const [latency, setLatency] = useState<number | null>(null);
    const [status, setStatus] = useState<"fast" | "slow" | "disconnected">("fast");
    const socketRef = useRef<WebSocket | null>(null);
    const pingTimer = useRef<NodeJS.Timeout | null>(null);
    const responseTimer = useRef<NodeJS.Timeout | null>(null);

    const updateStatus = (lat: number) => {
        if (lat < 500) setStatus("fast");
        else if (lat < 10000) setStatus("slow");
        else setStatus("disconnected");
    };

    const sendPing = () => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            const start = Date.now();
            socketRef.current.send("ping");
            responseTimer.current = setTimeout(() => setStatus("slow"), timeout);

            socketRef.current.onmessage = (event) => {
                if (event.data === "true") {
                    const lat = Date.now() - start;
                    setLatency(lat);
                    updateStatus(lat);
                    clearTimeout(responseTimer.current!);
                }
            };
        }
    };

    const cleanup = () => {
        if (socketRef.current) socketRef.current.close();
        if (pingTimer.current) clearInterval(pingTimer.current);
        if (responseTimer.current) clearTimeout(responseTimer.current);
    };

    const connectWebSocket = () => {
        cleanup();
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            console.log("✅ WebSocket connected!");
            pingTimer.current = setInterval(sendPing, interval);
        };

        socketRef.current.onclose = () => {
            console.log("❌ WebSocket disconnected!");
            setStatus("disconnected");
            setLatency(null);
            cleanup();
            setTimeout(connectWebSocket, 5000); // Tự động reconnect
        };

        socketRef.current.onerror = (error) => {
            console.error("⚠ WebSocket error:", error);
            setStatus("disconnected");
        };
    };

    useEffect(() => {
        connectWebSocket();
        return cleanup; // Cleanup khi unmount hoặc dependency thay đổi
    }, [url, interval, timeout]);

    return { latency, status };
};

export default useWebSocketPing;