import { WebSocket } from "ws";
import { WebSocketServer } from "ws";
import type { RoomI, UserI } from "./types/type.js";

const allSocket = new Map<WebSocket, UserI>();
const availableRooms = new Map<string, RoomI>();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {

    // Assign userId ONCE per ws connection
    const connectedUserId = Math.floor(Math.random() * 10000).toString();
    allSocket.set(ws, { userId: connectedUserId, username: "", roomId: "" });

    ws.on("message", (message: any) => {
        const response = JSON.parse(message);


        if (response.type === "create") {

            const { room_name, description, password, username } = response.payload;

            if (!room_name || !description || !password || !username) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid Input" }));
                return;
            }

            const roomExists = Array.from(availableRooms.values())
                .some(r => r.room_name === room_name);

            if (roomExists) {
                ws.send(JSON.stringify({ type: "error", message: "Room Already Exists" }));
                return;
            }

            const roomId = Math.floor(Math.random() * 10000).toString();

            allSocket.set(ws, { userId: connectedUserId, username, roomId });

            availableRooms.set(roomId, {
                room_name,
                description,
                password,
                roomId,
                members: [{ username, userId: connectedUserId, roomId }],
                owner: { username, userId: connectedUserId }
            });

            ws.send(JSON.stringify({
                type: "success",
                payload: {
                    roomId,
                    owner: username,
                    room_name,
                    userId : connectedUserId
                }
            }));
            console.log(JSON.stringify({
                type: "success",
                payload: {
                    roomId,
                    owner: username,
                    room_name,
                    userId : connectedUserId
                }
            }))
            return;
        }


        if (response.type === "join") {
            const { username, roomId, password } = response.payload;

            if (!username || !roomId) {
                ws.send(JSON.stringify({ type: "error", message: "Invalid input" }));
                return;
            }

            const room = availableRooms.get(roomId);

            if (!room) {
                ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
                return;
            }

            if (room.password !== password) {
                ws.send(JSON.stringify({ type: "error", message: "Wrong password" }));
                return;
            }

            // Update connected user data
            allSocket.set(ws, { userId: connectedUserId, username, roomId });

            // Add to room
            room.members.push({ username, userId: connectedUserId, roomId });

            // Notifying every member except the joining user
            for (const member of room.members) {

                const memberSocket = [...allSocket.entries()]
                    .find(([sock, u]) => u.userId === member.userId)?.[0];

                if (!memberSocket) continue;
                if (member.userId === connectedUserId) continue;

                memberSocket.send(JSON.stringify({
                    type: "join-notification",
                    message: `${username} joined the room`,
                    user: { username, userId: connectedUserId }
                }));
            }

            ws.send(JSON.stringify({type :"success",message :"Joined Room Successfully"}))

            return;
        }

        if (response.type === "chat") {
            const { userId, roomId, message } = response.payload;

            const room = availableRooms.get(roomId);
            if (!room) {
                ws.send(JSON.stringify({ type: "error", message: "Room Not Found" }));
                return;
            }

            const userExist = room.members.find(m => m.userId === userId);
            if (!userExist) {
                ws.send(JSON.stringify({ type: "error", message: "User Does Not Exist" }));
                return;
            }

            for (const member of room.members) {

                const memberSocket = [...allSocket.entries()]
                    .find(([sock, u]) => u.userId === member.userId)?.[0];

                if (!memberSocket) continue;

                if (member.userId === userId) continue;

                memberSocket.send(JSON.stringify({
                    type: "chat-message",
                    message,
                    from: { username: userExist.username, userId }
                }));
            }
        }


    });
});
