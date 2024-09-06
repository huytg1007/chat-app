
import { Typography, Button } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../Context/AppProvider";
import { AppContextType } from "../../Models/AppContext";
import RoomChat from "./RoomChat";
import { useContext } from "react";

const WrapperStyled = styled.div`
  height: 80vh;

  .header {
    &__info {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 16px;
    }

    &__content {
      font-size: 20px;
      color: white;
      margin-left: 5px;
      font-weight: bold;
    }

    &__add-room {
      color: white;
      margin-left: 30px;
    }
  }
  .room-list {
    height: 90vh;
  }
`;

export default function RoomList() {
  const { rooms, setIsAddRoomVisible, setSelectedRoomId } = useContext<AppContextType>(AppContext);

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  return (
    <WrapperStyled>
        <div className="header__info">
        <Typography.Text className="header__content"> Đoạn chat</Typography.Text>
          <Button
            style={{ color: "white" }}
            type="text"
            icon={<PlusSquareOutlined />}
            className="header__add-room"
            onClick={handleAddRoom}
          >
            Thêm phòng
          </Button>
        </div>
        <div className="room-list">
          <div className="w-full h-full overflow-y-auto p-4">
            {rooms.map((room) => (
              <RoomChat
                key={room.id}
                room={room}
                setSelectedRoomId={setSelectedRoomId}
                isSelected={false}
              />
            ))}
          </div>
        </div>
    </WrapperStyled>
  );
}
