'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Socket, io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export const useSocket = ({ namespace, connectOnMount = false }: { namespace?: string; connectOnMount?: boolean } = {}) => {
    const socketRef = useRef<Socket | null>(null);
    const [, forceRender] = useState(0);

    const connectSocket = useCallback(() => {
        if (socketRef.current) return;

        const socketInstance = io(namespace ? `${SOCKET_URL}${namespace}` : SOCKET_URL, {
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            transports: ['websocket'],
        });

        socketInstance.on('connect', () => {
            socketRef.current = socketInstance;
            forceRender((prev) => prev + 1);
            console.log(`Connected to ${namespace || 'default'} namespace`);
        });

        socketInstance.on('disconnect', (reason) => {
            console.warn(`Disconnected: ${reason}`);
            socketRef.current = null;
            forceRender((prev) => prev + 1);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Connection error:', error.message);
        });

        socketInstance.on('reconnect_attempt', (attemptNumber) => {
            console.log(`Reconnect attempt ${attemptNumber}`);
        });

        socketRef.current = socketInstance;
    }, [namespace]);

    useEffect(() => {
        if (connectOnMount) connectSocket();
        return () => {
            console.log('Disconnecting socket', namespace, socketRef.current?.id);
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectSocket, connectOnMount]);

    const reconnect = useCallback(() => {
        if (!socketRef.current) connectSocket();
    }, [connectSocket]);

    const disconnect = useCallback(() => {
        socketRef.current?.disconnect();
        socketRef.current = null;
        forceRender((prev) => prev + 1);
    }, []);

    return { socket: socketRef.current, connect: connectSocket, reconnect, disconnect };
};
