import React, { Dispatch, SetStateAction } from "react";
import { Room } from "../../Models/Room";
import useFirestore from "../../hooks/useFirestore";

type Props = {
  room: Room;
  setSelectedRoomId: Dispatch<SetStateAction<string | undefined>>;
  isSelected: boolean;
};

const RoomChat = ({ room, setSelectedRoomId, isSelected }: Props) => {

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: room?.id,
    }),
    [room?.id]
  );

  const lastMessage = useFirestore('messages', condition, 1, "desc");

  return (
    <div
      // className="flex items-center p-4 bg-gray-700  hover:bg-gray-100 border-b border-gray-300 cursor-pointer"
      className={`flex items-center p-4 cursor-pointer border-b border-gray-300 
        ${isSelected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#242526] hover:bg-gray-100'} 
        transition duration-300`}
      onClick={() => setSelectedRoomId(room.id)}
    >
      <img
        src={room.avatar}
        alt={"name"}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="ml-4">
        <div className="text-white font-semibold text-lg">{room.name}</div>
        <div className="text-gray-500 text-sm">
          {lastMessage[0] && (
            lastMessage[0].fileURL ? 'đã gửi một ảnh' : lastMessage[0].text
          )}
    </div>
      </div>
    </div>
  );
};

export default RoomChat;
