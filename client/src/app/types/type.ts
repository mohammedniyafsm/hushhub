export interface DataI {
  type: string;
  payload?: MessageI | CreateRoomI | JoinRoomI | ChatMessage |createdRoomI ;
  message?: string
}

export interface MessageI {
  username: string;
  userId: string;
  roomId: string;
  message: string;
}

export interface CreateRoomI {
  room_name: string;
  description: string;
  password: string;
  username: string;
}

export interface JoinRoomI {
  username: string;
  roomId: string;
  password: string;
}

export interface ChatMessage {
  username: string;
  userId: string;
  roomId: string;
  message: string;
}


export interface createdRoomI {
  roomId: string
  owner: string,
  room_name: string,
  userId: string,
  password : string,
  admin : string,
  username : string,
  description : string
}

