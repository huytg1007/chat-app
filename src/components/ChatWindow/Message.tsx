
import { Avatar, Typography, Image } from 'antd';
import styled from 'styled-components';
import { formatRelative } from 'date-fns/formatRelative'
import { MessageModel } from '../../Models/Message';

const WrapperStyled = styled.div<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isCurrentUser }) => (isCurrentUser ? 'flex-end' : 'flex-start')};
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 8px;

  .message-header {
    display: flex;
    align-items: center;
  }

  .message-body {
    margin-top: 10px;
  }

  .author {
    color: white;
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content-text {
    color: white;
    margin-left: 30px;
    padding: 8px;
    margin-bottom: 30px;
    border-radius: 8px;
    background-color: ${({ isCurrentUser }) => (isCurrentUser ? '#303030' : '#3475b8')}; /* Optional: different background color */
  }

  .content-file {
    color: white;
    margin-top: 10px; 
    margin-left: 30px;
  }
`;

function formatDate(seconds: number) {
  let formattedDate = '';
  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
}


export default function Message({ text, displayName, createdAt, photoURL, fileURL, isCurrentUser }: MessageModel) {
  return (
    <WrapperStyled isCurrentUser={isCurrentUser}>
      <div className='message-header'>
        <Avatar size='small' src={photoURL}>
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='author'>{displayName}</Typography.Text>
        <Typography.Text className='date'>
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>
      <div className='message-body'>
        <div>
          {text && (
            <Typography.Text className='content-text'>{text}</Typography.Text>
          )}
        </div>
        {fileURL && (
          <div className='content-file'>
            <Image width={100} src={fileURL} />
          </div>
        )}
      </div>
     
    </WrapperStyled>
  );
}