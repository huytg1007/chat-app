import { useContext } from 'react';
import { Form, Modal, Input } from 'antd';
import { AppContext } from '../Context/AppProvider';
import {  changeRoomName } from '../firebase/service';
import { AuthContext } from '../Context/AuthProvider';
import { AppContextType } from '../Models/AppContext';

export default function ChangeRoomNameModal() {
  const { selectedRoom, isChangeRoomNameVisible, setIsChangeRoomNameVisible } = useContext<AppContextType>(AppContext);
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();

  // console.log(isAddRoomVisible)

  const handleOk = () => {
    // handle logic
    // add new room to firestore
    changeRoomName(form.getFieldsValue().name, selectedRoom.id );
    // reset form value
    form.resetFields();
    setIsChangeRoomNameVisible(false);
  };

  const handleCancel = () => {
    // reset form value
    form.resetFields();

    setIsChangeRoomNameVisible(false);
  };

  return (
    <div>
     
      <Modal
        title='Tạo phòng'
        open={isChangeRoomNameVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
         
        <Form form={form} layout='vertical'>
          <Form.Item label='Tên phòng' name='name'>
            <Input defaultValue={selectedRoom?.name || ""} placeholder='Nhập tên phòng' />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  );
}