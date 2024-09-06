import React, { useEffect, useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import { UserContextType } from '../Models/User';
import { Room } from '../Models/Room';
import { AuthContext } from './AuthProvider';
import { AppContextType } from '../Models/AppContext';

export const AppContext = React.createContext<AppContextType>({} as AppContextType);

type Props = { children: React.ReactNode };

export default function AppProvider({ children }: Props) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [isChangeRoomNameVisible, setIsChangeRoomNameVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);

  const {user, } = React.useContext<UserContextType>(AuthContext);

  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: user?.uid,
    };
  }, [user?.uid]);

  const rooms = useFirestore('rooms', roomsCondition);
  
  useEffect(() => {
    if(rooms[0]){
      if(!selectedRoom){
        // console.log(rooms[0]);
        const initRoomId = rooms[0].id
        setSelectedRoomId(initRoomId);
      }
    } 
  },[rooms]);

  const selectedRoom = React.useMemo<Room>(
    () => rooms.find((room: { id: string | undefined; }) => room.id === selectedRoomId),
    [rooms, selectedRoomId]
  );
  
  const usersCondition = React.useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom?.members || [],
    };
  }, [selectedRoom?.members]);

  const members = useFirestore('users', usersCondition);


  const clearState = () => {
    setSelectedRoomId('');
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
    setIsChangeRoomNameVisible(false);
  };

  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        selectedRoom,
        isAddRoomVisible,
        isInviteMemberVisible,
        isChangeRoomNameVisible,
        selectedRoomId,
        setSelectedRoomId,
        setIsAddRoomVisible,
        setIsInviteMemberVisible,
        setIsChangeRoomNameVisible,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}