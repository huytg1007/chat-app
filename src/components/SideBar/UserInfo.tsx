import React from 'react';
import { Button, Avatar, Typography } from 'antd';
import styled from 'styled-components';

import { auth } from '../../firebase/config';
import { AuthContext, useAuth } from '../../Context/AuthProvider';
import { AppContext } from '../../Context/AppProvider';
import { UserContextType } from '../../Models/User';
import { AppContextType } from '../../Models/AppContext';

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);

  .username {
    color: white;
    margin-left: 5px;
  }
`;

export default function UserInfo() {
  const { user } = React.useContext<UserContextType>(AuthContext);
  const { clearState } = React.useContext<AppContextType>(AppContext);
  const { logout } = React.useContext<UserContextType>(AuthContext);

  return (
    <WrapperStyled>
      <div>
        <Avatar src={user?.photoURL}>
          {user?.photoURL ? '' : user?.displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='username'>{user?.displayName}</Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          // clear state in App Provider when logout
          clearState();
          logout();
          auth.signOut();
        }}
      >
        Đăng xuất
      </Button>
    </WrapperStyled>
  );
}