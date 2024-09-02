export type ChatWindowModel = {
    displayName: string,
    email: string | null,
    uid: string ,
    photoURL?: string,
    text: string,
    createdAt: any;
  };  

export type MessageModel = {
    displayName: string,
    photoURL?: string,
    text: string,
    createdAt: any;
}