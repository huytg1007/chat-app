import { useContext, useRef } from 'react';
import { Avatar, Button, Collapse, Space, Typography } from 'antd';
import { BellOutlined, SearchOutlined, LockOutlined, FileOutlined, FileImageOutlined, EditOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import { AppContextType } from '../../Models/AppContext';
import { AppContext } from '../../Context/AppProvider';
import { changeAvatar, uploadImage } from '../../firebase/service';

const { Panel } = Collapse;

const SidebarWrapper = styled.div`
  margin-left: 1px;
  height: 100vh;
  background-color: #242526;
  color: white;
  padding: 16px;

  .username {
    margin-left: 5px;
    font-weight: bold;
    color: white;
  }
    
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 16px;
  color: white;

  .avatar {
    margin-bottom: 8px;
  }

  .roomName {
    font-weight: bold;
    color: white;
  }

  .encryption {
    display: block;
    margin-top: 8px;
    color: white;
    font-size: 12px;
  }
  
  .text{
    color: white;
  }
`;

const ButtonGroup = styled(Space)`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  color: white;

  .ant-btn {
    color: white;
    border-color: #3b82f6;
  }
`;

const CustomPanel = styled(Panel)`

  color: white;
  .ant-collapse-header {
    color: white !important; /* Add !important to ensure the style is applied */
  }

`;

export default function RightSideBar() {
  const { setIsChangeRoomNameVisible, selectedRoom, members } = useContext<AppContextType>(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadImage(file).then(async (url) => {
        if (url) {
          await changeAvatar(url, selectedRoom.id);
        } 
      });
    }
  };

  const handleButtonClick = () => {
    if(fileInputRef.current !== null){
      fileInputRef.current.click();
    }
  };

  return (
    <SidebarWrapper>
      
      <HeaderSection>
        <Avatar className="avatar" size={64} src={selectedRoom?.avatar || ""} />
        <div className="roomName">{selectedRoom?.name || ""}</div>
        <span className="encrption">Được mã hóa đầu cuối</span>
      </HeaderSection>

      <ButtonGroup>
        <Button style={{background: 'gray'}} icon={<BellOutlined />} type="default">Tắt thông báo</Button>
        <Button style={{background: 'gray'}} icon={<SearchOutlined />} type="default">Tìm kiếm</Button>
      </ButtonGroup>

      <Collapse ghost>
        <CustomPanel header="Thành viên trong đoạn chat" key="1">
          {members.map((member) => (
            <div style={{margin: 8}} key={member.uid}>
              <Avatar src={member?.photoURL}>
                {member?.photoURL ? '' : member?.displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography.Text className='username'>{member?.displayName}</Typography.Text>
            </div>
          ))}
        </CustomPanel>

        <CustomPanel header="Tùy chỉnh đoạn chat" key="2">
          <Space direction="vertical">
            <Button onClick={() => setIsChangeRoomNameVisible(true)} icon={<EditOutlined />} type="text" style={{ color: 'white' }}>
              Đổi tên đoạn chat
            </Button>
            <Button
              icon={<FileOutlined />}
              type="text"
              style={{ color: 'white' }}
              onClick={handleButtonClick}
            >
              Thay đổi ảnh
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </Space>
        </CustomPanel>

        <CustomPanel header="File phương tiện & file" key="3">
          <Space direction="vertical">
            <Button icon={<FileImageOutlined />} type="text" style={{ color: 'white' }}>File phương tiện</Button>
            <Button icon={<FileOutlined />} type="text" style={{ color: 'white' }}>File</Button>
          </Space>
        </CustomPanel>

      </Collapse>
    </SidebarWrapper>
  );
};


