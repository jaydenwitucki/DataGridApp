import { useEffect, useState } from 'react';

export const useWebSocket = (url, onMessageReceived) => {
    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            onMessageReceived(message);
        };

        return () => {
            ws.close();
        };
    }, [url, onMessageReceived]);
};