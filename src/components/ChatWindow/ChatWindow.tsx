import { UserAddOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Tooltip, Avatar, Form, Input, Alert, Image } from 'antd';
import { FileImageOutlined, CloseOutlined } from '@ant-design/icons';
import Message from './Message';
import useFirestore from '../../hooks/useFirestore';
import { addDocument, uploadImage } from '../../firebase/service';
import { AuthContext } from '../../Context/AuthProvider';
import { AppContextType } from '../../Models/AppContext';
import { UserContextType } from '../../Models/User';
import { AppContext } from '../../Context/AppProvider';
import { ChatWindowModel } from '../../Models/Message';

const HeaderStyled = styled.div`
  color: white;
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 16px;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  background: #242526;
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

type previewImage = {
  name: string,
  url: string
}

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible } = useContext<AppContextType>(AppContext);
  const { user } = useContext<UserContextType>(AuthContext);

  // Provide default values during destructuring
  const { uid = '', photoURL, displayName = '' } = user || {};
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  
  const inputRef = useRef<any>(null);
  const messageListRef = useRef<any>(null);

  const [previewImage, setPreviewImage] = useState<previewImage | null>(null);
  const fileRef = useRef<HTMLInputElement | null | any>(null);


  useEffect(() => {
    // console.log(fileRef);
    // console.log(fileRef.current);
    // console.log(fileRef.current);
    // console.log(previewImage);
  }, [fileRef.current]);
  
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    // console.log(file);
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage({ name: file.name, url: previewUrl});
      // console.log("file: " + file);
      // console.log("current: " + fileRef.current);
      fileRef.current = file;
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleButtonClick = () => { 
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage({ name: file.name, url: previewUrl});
      fileRef.current = file;
    }
    // console.log("text: " + inputValue + "  " + "fileUrl: " + previewImage)
  };

  const resetFileInput = () => {
    setPreviewImage(null);
    if (fileRef.current) {
      console.log(fileRef.current);
      fileRef.current.value = "";
      console.log(fileRef.current);
    }
  };

  const fetchBlobFromUrl = async (blobUrl: string): Promise<Blob> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return blob;
  };

  const createFileFromBlob = (blob: Blob, fileName: string): File => {
    // You can optionally specify the MIME type here if known
    return new File([blob], fileName, { type: blob.type });
  };

  const handleOnSubmit = async () => {
    if(inputValue || fileRef.current){
      let finalFileUrl = "";
      if(previewImage){
        const blob = await fetchBlobFromUrl(previewImage.url);
        const file = createFileFromBlob(blob, previewImage.url);
        console.log(file);
        await uploadImage(file).then((url) => {
          if (url) {
            finalFileUrl = url;
            console.log("Image uploaded successfully. URL:", finalFileUrl);
            }
        });

        // After upload, clean up
        URL.revokeObjectURL(previewImage.url!);
        setPreviewImage(null);
        fileRef.current.value = "";
      }
      
      addDocument('messages', {
        text: inputValue,
        uid,
        photoURL: photoURL,
        fileURL: finalFileUrl,
        roomId: selectedRoom?.id,
        displayName,
      });

      form.resetFields(['message']);
  
      // focus to input again after submit
      if (inputRef?.current != null) {
        setTimeout(() => {
          inputRef.current?.focus();
        });
      }
    }
  };

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom?.id,
    }),
    [selectedRoom?.id]
  );

  const messages = useFirestore('messages', condition);

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled onDrop={handleDrop} onDragOver={handleDragOver}>
      {selectedRoom?.id ? (
        <>
          <HeaderStyled>

            <div className='header__info'>
              <div>
                <img
                  src={selectedRoom.avatar}
                  alt={"name"}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </div>
              <div>
                <p className='header__title'>{selectedRoom.name}</p>
                <span className='header__description'>
                  {selectedRoom.description}
                </span>
              </div>
            </div>

            <ButtonGroupStyled>
              <Button
                style={{color: 'white'}}
                icon={<UserAddOutlined />}
                type='text'
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>

              <Avatar.Group size='small' max={{ count: 2 }}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.uid}>
                  <Avatar src={member.photoURL}>
                    {member.photoURL
                      ? member.displayName?.charAt(0)?.toUpperCase()
                      : '' }
                  </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>

          </HeaderStyled>
        
          <ContentStyled>

            <MessageListStyled ref={messageListRef}>
            {messages.map((mes: ChatWindowModel, index: number) => {
              const isCurrentUser = mes.displayName?.trim() === displayName?.trim();
              return (
                <Message
                  key={mes.createdAt}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  fileURL={mes.fileURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                  isCurrentUser={isCurrentUser}
                />
              );
            })}
            </MessageListStyled>

            <FormStyled form={form}>
              <Button style={{backgroundColor: '#242526', margin: 2}} 
                icon={<FileImageOutlined 
                style={{color: 'white', width:20, marginLeft: 5}} 
                onClick={handleButtonClick}/>} 
                />
              {previewImage && (
                <div style={{ position: 'relative', marginRight: 8, background: '#3a3b3c'}}>
                  <Image
                    src={previewImage.url}
                    alt="Preview"
                    style={{ width: 40, height: 40, borderRadius: 4 }}
                    preview={false} // Disable the default image preview behavior
                  />
                  <Button
                    icon={<CloseOutlined />}
                    size="small"
                    shape="circle"
                    style={{ position: 'absolute', top: -10, right: -10, backgroundColor: '#242526', border: 'none' }}
                    onClick={resetFileInput}
                  />
                </div>
              )}
              <input
                type="file"
                ref={fileRef}
                style={{ display: 'none' }}
                accept="image/*" // Accept only image files
                onChange={handleFileChange}
              />
              
              <Form.Item name='message'>
                <Input
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder='Nhập tin nhắn...'
                  variant="outlined"
                  autoComplete='off'
                />
              </Form.Item>
              <Button type='primary' onClick={handleOnSubmit}>
                Gửi
              </Button>
            </FormStyled>

          </ContentStyled>
        </>
      ) : (
        <Alert
          message='Hãy chọn phòng'
          type='info'
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}