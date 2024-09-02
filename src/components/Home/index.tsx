import { Row, Col } from 'antd';
import ChatWindow from '../ChatWindow/ChatWindow';
import Sidebar from '../SideBar/Sidebar'
import RightSideBar from '../RightSideBar/RightSideBar';

export default function ChatRoom() {

  return (
    <div>
      <Row>
        <Col span={5} style={{paddingRight: 1}}>
          <Sidebar />
        </Col>
        <Col span={14}>
          <ChatWindow />
        </Col>
        <Col span={5}>
          <RightSideBar/>
        </Col>
      </Row>
    </div>
  );
}