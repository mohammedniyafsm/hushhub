// Generic Base Incoming Message
export interface ServerEvent<T = ServerPayload> {
  type: string;
  payload?: T;
  message?: string;
}

export type ClientEvent =
  | CreateRoomI
  | JoinRoomI
  | SendChatI
  | SendTypingI
  | TypingDoneI
  | KickUserI;


// ROOM CREATED
export interface RoomCreatedPayload {
  roomId: string;
  room_name: string;
  description: string;
  password: string;   
  username: string;
  admin: string;
  userId: string;
  total : number
}


// JOINED ROOM
export interface JoinedRoomPayload {
  roomId: string;
  room_name: string;
  description: string;
  password: string;   // <-- Add
  username: string;
  admin: string;
  total: number;
  userId: string;
  members: {
    userId: string;
    username: string;
  }[];
}


// JOIN NOTIFICATION
export interface JoinNotificationPayload {
  members: { userId: string; username: string }[];
  total: number;
  joinUser: string;
}

// LEAVE NOTIFICATION
export interface LeaveNotificationPayload {
  username: string;
  members: { userId: string; username: string }[];
  total: number;
}

// CHAT MESSAGE
export interface ChatMessagePayload {
  username: string;
  userId: string;
  roomId: string;
  message: string;
}

// TYPING EVENT
export interface TypingPayload {
  userId: string;
  roomId: string;
  username: string;
}

// KICK / UNBLOCK
export interface KickNotificationPayload {
  targetId: string;
  username : string
}

export interface UnblockNotificationPayload {
  targetId: string;
}

export interface KickedPayload {
  message: string;
}

// ERROR
export interface ErrorPayload {
  message: string;
}

// COMBINED PAYLOAD TYPE
export type ServerPayload =
  | RoomCreatedPayload
  | JoinedRoomPayload
  | JoinNotificationPayload
  | LeaveNotificationPayload
  | ChatMessagePayload
  | KickNotificationPayload
  | UnblockNotificationPayload
  | TypingPayload
  | KickedPayload
  | ErrorPayload
  | undefined;

// main WS event
export interface DataI {
  type: string;
  payload?: ServerPayload;
  message?: string;
}

// CLIENT → SERVER TYPES
export interface CreateRoomI {
  type: "create";
  payload: {
    room_name: string;
    description: string;
    password: string;
    username: string;
  };
}

export interface JoinRoomI {
  type: "join";
  payload: {
    username: string;
    roomId: string;
    password: string;
  };
}

export interface SendChatI {
  type: "chat";
  payload: {
    userId: string;
    username : string;
    roomId: string;
    message: string;
  };
}

export interface SendTypingI {
  type: "typing";
  payload: {
    userId: string;
    roomId: string;
  };
}

export interface TypingDoneI {
  type: "typing-done";
  payload: {
    userId: string;
    roomId: string;
  };
}


export interface KickUserI {
  type: "kick";
  payload: {
    roomId: string;
    targetId: string;
    userId: string;
  };
}
