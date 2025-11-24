import type WebSocket from "ws"

export interface UserI {
    userId : string,
    username : string,
    roomId : string,
    ws?: WebSocket,
}

export interface RoomI  {
    room_name : string,
    description : string,
    password? : string,
    roomId : string,
    members : UserI[], 
    owner : {
        userId : string,
        username : string,
    },
    total : number
}