
import { useEffect, useRef, useState } from "react";

const useWebSocketPing = (url: string, interval = 5000, timeout = 5000) => {
    const [latency, setLatency] = useState<number | null>(null);
    const [status, setStatus] = useState<"fast" | "slow" | "disconnected">("fast");
    const socketRef = useRef<WebSocket | null>(null);
    const pingTimer = useRef<NodeJS.Timeout | null>(null);
    const responseTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const connectWebSocket = () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            socketRef.current = new WebSocket(url);

            socketRef.current.onopen = () => {
                console.log("✅ WebSocket connected!");
                pingTimer.current = setInterval(() => {
                    if (socketRef.current?.readyState === WebSocket.OPEN) {
                        const start = Date.now();
                        socketRef.current.send("ping");
                        responseTimer.current = setTimeout(() => {
                            setStatus("slow");
                        }, timeout);
                        socketRef.current.onmessage = (event) => {
                            const message = event.data;
                            if (message === "true") {
                                const latency = Date.now() - start;
                                setLatency(latency);

                                if (latency < 500) {
                                    setStatus("fast");
                                } else if (latency >= 500 && latency < 10000) {
                                    setStatus("slow");
                                } else {
                                    setStatus("disconnected");
                                }
                                clearTimeout(responseTimer.current!);
                            }
                        };
                    }
                }, interval);
            };
            socketRef.current.onclose = () => {
                console.log("❌ WebSocket disconnected!");
                setStatus("disconnected");
                setLatency(null);
                if (pingTimer.current) {
                    clearInterval(pingTimer.current);
                }
                setTimeout(connectWebSocket, 5000);
            };
            socketRef.current.onerror = (error) => {
                console.error("⚠ WebSocket error:", error);
                setStatus("disconnected");
            };
        };
        connectWebSocket();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (pingTimer.current) {
                clearInterval(pingTimer.current);
            }
            if (responseTimer.current) {
                clearTimeout(responseTimer.current);
            }
        };
    }, [url, interval, timeout]);
    return { latency, status };
};

export default useWebSocketPing;
