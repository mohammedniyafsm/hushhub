import { WebSocketServer, WebSocket } from "ws";
import http from "http";
// Maps
const allSocket = new Map(); // key = userId
const availableRooms = new Map(); // key = roomId
const server = http.createServer();
const wss = new WebSocketServer({ server });
server.listen(8080, () => {
    console.log("WebSocket Server running on port 8080");
});
wss.on("connection", (ws) => {
    // assign temp user
    const userId = Math.floor(Math.random() * 90000 + 10000).toString();
    const newUser = {
        userId,
        username: "",
        roomId: "",
        blocked: false,
        ws
    };
    allSocket.set(userId, newUser);
    ws.on("message", raw => {
        let data;
        try {
            data = JSON.parse(raw.toString());
        }
        catch {
            return ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
        }
        // =================================================================
        // CREATE ROOM
        // =================================================================
        if (data.type === "create") {
            const { room_name, description, password, username } = data.payload;
            if (!room_name || !description || !password || !username)
                return ws.send(JSON.stringify({ type: "error", message: "Invalid Input" }));
            const exists = [...availableRooms.values()]
                .find(r => r.room_name === room_name);
            if (exists)
                return ws.send(JSON.stringify({ type: "error", message: "Room Already Exists" }));
            const roomId = Math.floor(Math.random() * 90000 + 10000).toString();
            const user = allSocket.get(userId);
            user.username = username;
            user.roomId = roomId;
            const room = {
                roomId,
                room_name,
                description,
                password,
                members: [user],
                owner: { userId, username },
                total: 1
            };
            availableRooms.set(roomId, room);
            ws.send(JSON.stringify({
                type: "room-created-success",
                payload: {
                    roomId,
                    room_name,
                    description,
                    username,
                    password,
                    admin: username,
                    total: room.total,
                    userId,
                }
            }));
            return;
        }
        // =================================================================
        // JOIN ROOM
        // =================================================================
        if (data.type === "join") {
            const { username, roomId, password } = data.payload;
            const room = availableRooms.get(roomId);
            if (!room)
                return ws.send(JSON.stringify({ type: "error", message: "Room Not Found" }));
            if (room.password !== password)
                return ws.send(JSON.stringify({ type: "error", message: "Wrong Password" }));
            const user = allSocket.get(userId);
            if (user.blocked)
                return ws.send(JSON.stringify({ type: "error", message: "You are blocked" }));
            // Update user
            user.username = username;
            user.roomId = roomId;
            // Prevent double join
            if (!room.members.find(m => m.userId === userId)) {
                room.members.push(user);
                room.total++;
            }
            const membersList = room.members
                .filter(m => !m.blocked)
                .map(m => ({
                userId: m.userId,
                username: m.username
            }));
            // notify everyone
            for (const m of room.members) {
                if (m.userId === userId)
                    continue;
                if (!m.blocked) {
                    m.ws?.send(JSON.stringify({
                        type: "join-notification",
                        payload: {
                            members: membersList,
                            total: room.total,
                            joinUser: username
                        }
                    }));
                }
            }
            ;
            // send back to joining user
            ws.send(JSON.stringify({
                type: "joined-room",
                payload: {
                    roomId,
                    room_name: room.room_name,
                    description: room.description,
                    password: room.password,
                    username,
                    admin: room.owner.username,
                    total: room.total,
                    members: membersList,
                    userId
                }
            }));
            return;
        }
        // =================================================================
        // CHAT MESSAGE
        // =================================================================
        if (data.type === "chat") {
            const { userId, roomId, message } = data.payload;
            const room = availableRooms.get(roomId);
            if (!room)
                return;
            const user = room.members.find(m => m.userId === userId);
            if (!user || user.blocked)
                return;
            room.members.forEach(m => {
                if (!m.blocked) {
                    m.ws?.send(JSON.stringify({
                        type: "chat-message",
                        payload: {
                            username: user.username,
                            userId,
                            roomId,
                            message
                        }
                    }));
                }
            });
            return;
        }
        // =================================================================
        // TYPING START
        // =================================================================
        if (data.type === "typing") {
            const { userId, roomId } = data.payload;
            const room = availableRooms.get(roomId);
            if (!room)
                return;
            const user = room.members.find(m => m.userId === userId);
            if (!user || user.blocked)
                return;
            room.members.forEach(m => {
                if (!m.blocked && m.userId !== userId) {
                    m.ws?.send(JSON.stringify({
                        type: "typing",
                        payload: { userId, username: user.username }
                    }));
                }
            });
            return;
        }
        // =================================================================
        // TYPING END  (FIX ADDED)
        // =================================================================
        if (data.type === "typing-done") {
            const { userId, roomId } = data.payload;
            const room = availableRooms.get(roomId);
            if (!room)
                return;
            room.members.forEach(m => {
                if (!m.blocked && m.userId !== userId) {
                    m.ws?.send(JSON.stringify({
                        type: "typing-done",
                        payload: { userId }
                    }));
                }
            });
            return;
        }
        // =================================================================
        // KICK (BLOCK USER)
        // =================================================================
        if (data.type === "kick") {
            const { roomId, targetId, userId } = data.payload;
            const room = availableRooms.get(roomId);
            if (!room)
                return;
            if (room.owner.userId !== userId)
                return ws.send(JSON.stringify({ type: "error", message: "Not Admin" }));
            const target = room.members.find(m => m.userId === targetId);
            if (!target)
                return ws.send(JSON.stringify({ type: "error", message: "User Not Found" }));
            const username = target.username;
            target.blocked = true;
            target.ws?.send(JSON.stringify({ type: "kicked", message: "You are blocked" }));
            target.ws?.close();
            // notify others
            room.members.forEach(m => {
                if (!m.blocked) {
                    m.ws?.send(JSON.stringify({
                        type: "kick-notification",
                        payload: { targetId, username }
                    }));
                }
            });
            return;
        }
    });
    // =================================================================
    // USER SOCKET CLOSED
    // =================================================================
    ws.on("close", () => {
        const user = allSocket.get(userId);
        if (!user)
            return;
        const { username, roomId } = user;
        const room = availableRooms.get(roomId);
        if (room) {
            room.members = room.members.filter(m => m.userId !== userId);
            room.total--;
            const membersLeft = room.members
                .filter(m => !m.blocked)
                .map(m => ({ userId: m.userId, username: m.username }));
            room.members.forEach(m => {
                if (!m.blocked) {
                    m.ws?.send(JSON.stringify({
                        type: "leave-notification",
                        payload: { username, members: membersLeft, total: room.total }
                    }));
                }
            });
            if (room.total === 0)
                availableRooms.delete(roomId);
        }
        allSocket.delete(userId);
    });
});
//# sourceMappingURL=index.js.map