import { Dispatch, SetStateAction } from "react";
import { Room } from "./Room";
import { UserProfile } from "./User";

export type AppContextType = {
    rooms: Room[];
    members: UserProfile[];
    selectedRoom: Room;
    isAddRoomVisible: boolean;
    selectedRoomId: string | undefined;
    isInviteMemberVisible: boolean;
    isChangeRoomNameVisible: boolean;
    setSelectedRoomId: Dispatch<SetStateAction<string | undefined>>;
    setIsAddRoomVisible: Dispatch<SetStateAction<boolean>>;
    setIsInviteMemberVisible: Dispatch<SetStateAction<boolean>>;
    setIsChangeRoomNameVisible: Dispatch<SetStateAction<boolean>>;
    clearState: () => void;
  };
  