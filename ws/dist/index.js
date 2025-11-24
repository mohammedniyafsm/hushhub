import { WebSocket } from "ws";
import { WebSocketServer } from "ws";
const allSocket = new Map();
const availableRooms = new Map();
const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", (ws) => {
    const connectedUserId = Math.floor(Math.random() * 10000).toString();
    allSocket.set(ws, { userId: connectedUserId, username: "", roomId: "" });
    ws.on("message", (message) => {
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
                owner: { username, userId: connectedUserId },
                total: 1
            });
            ws.send(JSON.stringify({
                type: "room-created-success",
                payload: {
                    roomId,
                    room_name,
                    description,
                    password: password,
                    admin: username,
                    username: username,
                    userId: connectedUserId
                }
            }));
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
            // Update socket user details
            allSocket.set(ws, { userId: connectedUserId, username, roomId });
            // Add user to room
            room.members.push({ username, userId: connectedUserId, roomId });
            room.total++;
            // Format members list for UI (username only)
            const formattedMembers = room.members.map(m => ({
                username: m.username
            }));
            // Notify other members
            for (const member of room.members) {
                const memberSocket = [...allSocket.entries()]
                    .find(([sock, u]) => u.userId === member.userId)?.[0];
                if (!memberSocket)
                    continue;
                // Skip sending join notification to the joining user
                if (member.userId === connectedUserId)
                    continue;
                memberSocket.send(JSON.stringify({
                    type: "join-notification",
                    message: `${username} joined the room`,
                    payload: {
                        members: formattedMembers,
                        total: room.total
                    }
                }));
            }
            // Send success response to the joining user
            ws.send(JSON.stringify({
                type: "joined-room",
                message: "Joined Room Successfully",
                payload: {
                    roomId: room.roomId,
                    room_name: room.room_name,
                    description: room.description,
                    username,
                    admin: room.owner.username,
                    total: room.total,
                    members: formattedMembers
                }
            }));
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
                if (!memberSocket)
                    continue;
                memberSocket.send(JSON.stringify({
                    type: "chat-message",
                    payload: { username: userExist.username, userId, roomId, message }
                }));
            }
        }
        if (response.type === "type") {
            const { userId, roomId } = response.payload;
            const room = availableRooms.get(roomId);
            if (!room) {
                ws.send(JSON.stringify({ type: "error", message: "Room Doesnt Exist" }));
                return;
            }
            const user = room.members.find((s) => s.userId === userId);
            if (!user) {
                ws.send(JSON.stringify({ type: "error", message: "User Doent Exist in The Room" }));
                return;
            }
            for (const member of room.members) {
                const memberSocket = [...allSocket.entries()]
                    .find(([sock, u]) => u.userId === member.userId)?.[0];
                if (!memberSocket)
                    continue;
                if (member.userId === userId)
                    continue; // skip yourself
                memberSocket.send(JSON.stringify({
                    type: "typing",
                    payload: { userId, roomId, username: user.username }
                }));
            }
        }
    });
    ws.on("close", () => {
        const user = allSocket.get(ws);
        if (!user)
            return;
        const { userId, username, roomId } = user;
        const room = availableRooms.get(roomId);
        if (!room) {
            allSocket.delete(ws);
            return;
        }
        room.members = room.members.filter(m => m.userId !== userId);
        const formattedMembers = room.members.map(m => ({
            username: m.username
        }));
        for (const member of room.members) {
            const memberSocket = [...allSocket.entries()]
                .find(([sock, u]) => u.userId === member.userId)?.[0];
            if (!memberSocket)
                continue;
            memberSocket.send(JSON.stringify({
                type: "leave-notification",
                message: `${username} left the room`,
                payload: {
                    members: formattedMembers,
                    total: room.total
                }
            }));
        }
        allSocket.delete(ws);
        // If room becomes empty → delete room
        if (room.total === 0) {
            availableRooms.delete(roomId);
        }
    });
});
//# sourceMappingURL=index.js.map