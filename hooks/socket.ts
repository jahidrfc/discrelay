"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { Updater } from "use-immer";
import type { DataModel } from "@/types";
import { updateHandler } from "@/lib/handler";

export const useSocket = (
  setData: Updater<DataModel>
): Socket | null => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io({ transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log(socketRef.current?.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log(socketRef.current?.id);
    });

    socketRef.current.on("updates", (updates: string) => {
      updateHandler(setData, JSON.parse(updates));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};
