export type ChatWindowModel = {
    displayName: string,
    email: string | null,
    uid: string ,
    photoURL?: string,
    fileURL?: string,
    text: string,
    createdAt: any;
  };  

export type MessageModel = {
    displayName: string,
    photoURL?: string,
    fileURL?: string,
    text: string,
    createdAt: any;
    isCurrentUser: boolean;
}