import { Badge, Button, message, Upload } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormGroup, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { fetchRoomList, updateRoom } from '@/services/user';
import moment from 'moment';
import { handleUpload } from '@/utils';



const RoomTypeMap = {
  4: "房主电台",
  1: "音乐点歌",
  0: "文字聊天"
}
const RoomList: React.FC = () => {
  const [updateVisible, handleModalVisible] = useState<boolean>(false);
  const updateRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();

  const loadData = async (params: any, sort: any, filter: any) => {
    const { pageSize, current: pageNum, keyword } = params;
    const retData = {
      data: [],
      success: true,
      total: 10
    };
    try {
      const res = await fetchRoomList({ pageNum, pageSize, keyword });
      retData.total = res?.data?.total;
      retData.data = res?.data?.list;
    } catch (error) {
      retData.success = false;
    }

    return retData;
  }
  const save = async (values: any) => {
    try {
      await updateRoom(values);
      message.success("更新成功");
      handleModalVisible(false);
      actionRef.current?.reload();
    } catch (error) { }
  }

  const columns: ProColumns<any>[] = [
    {
      title: "keyword",
      hideInTable: true,
      dataIndex: "keyword",
      valueType: "text",
      fieldProps: { placeholder: "RoomID/RoomUser/RoomName" },
    },
    {
      title: "ID",
      hideInSearch: true,
      dataIndex: 'room_id',
    },
    {
      title: "Owner ID",
      hideInSearch: true,
      dataIndex: 'room_user',
    },
    {
      title: "Online",
      hideInSearch: true,
      dataIndex: "room_online"
    },
    {
      title: "Name",
      hideInSearch: true,
      dataIndex: 'room_name',
    },
    {
      title: "Notice",
      hideInSearch: true,
      dataIndex: 'room_notice',
      ellipsis: true,
    },
    {
      title: "Type",
      hideInSearch: true,
      dataIndex: 'room_status',
      render: (_, row, __, ___) => RoomTypeMap[row.room_type]
    },
    {
      title: "Speak",
      hideInSearch: true,
      dataIndex: 'room_sendmsg',
      render: (_, row, __, ___) => (<Badge color={row.room_sendmsg == 0 ? "green" : "red"} />)
    },
    {
      title: "Robot",
      hideInSearch: true,
      dataIndex: 'room_robot',
      render: (_, row, __, ___) => (<Badge color={row.room_robot == 1 ? "green" : "red"} />)
    },
    {
      title: "Create time",
      hideInSearch: true,
      dataIndex: 'user_createtime',
      render: (dom, record, index, action) => {
        return moment(record.user_createtime*1000).format("YYYY/MM/DD")
      },
    },
    {
      title: "Status",
      hideInSearch: true,
      dataIndex: 'room_status',
      width: 60,
      render: (dom, record, index, action) => {
        return <Badge color={record.room_status === 0 ? "green" : "red"} />
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      render: (_, row, index) => [
        <a key={index} onClick={() => {
          handleModalVisible(true);
          updateRef.current?.setFieldsValue({ ...row, user_password: null });
        }}>
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="room_id"
        request={loadData}
        actionRef={actionRef}
        columns={columns}
      />
      <ModalForm
        title="Update Room"
        width="500px"
        formRef={updateRef}
        visible={updateVisible}
        onVisibleChange={handleModalVisible}
        onFinish={save}>
        <ProFormText rules={[{ required: true }]} name="room_id" hidden />
        <ProFormGroup>
          <ProFormText label="RoomName" rules={[{ required: true }]} name="room_name" />
          <ProFormText label="Notice" rules={[{ required: true }]} name="room_notice" />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormSelect label="RoomType" rules={[{ required: true }]} name="room_type" options={[{ label: "音乐点歌", value: 1 }, { label: "房主电台", value: 4 }, { label: "文字聊天", value: 0 }]} />
          <ProFormSelect label="IsPublic" rules={[{ required: true }]} name="room_public" options={[{ label: "加密", value: 1 }, { label: "公开", value: 0 }]} />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormSelect label="开启投票" rules={[{ required: true }]} name="room_votepass" options={[{ label: "OnlyOwner", value: 1 }, { label: "All", value: 0 }]} />
          <ProFormText label="投票比例" rules={[{ required: true, type: "number", max: 100 }]} name="room_votepercent" />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormSelect label="点歌权限" rules={[{ required: true }]} name="room_addsong" options={[{ label: "Enable", value: 1 }, { label: "Disable", value: 0 }]} />
          <ProFormSelect label="是否禁言" rules={[{ required: true }]} name="room_sendmsg" options={[{ label: "Enable", value: 1 }, { label: "Disable", value: 0 }]} />
        </ProFormGroup>

        <ProFormSelect label="Robot" rules={[{ required: true }]} name="room_robot" options={[{ label: "Enable", value: 1 }, { label: "Disable", value: 0 }]} />

        <ProFormGroup>
          <ProFormText label="点歌CD" rules={[{ required: true, type: "number", max: 60, min: 3 }]} name="room_addsongcd" />
          <ProFormText label="顶歌CD" rules={[{ required: true, type: "number", max: 60, min: 3 }]} name="room_pushsongcd" />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormText label="点歌限额" rules={[{ required: true, type: "number", max: 10, min: 1 }]} name="room_addcount" />
          <ProFormText label="顶歌日限额" rules={[{ required: true, type: "number", max: 10, min: 1 }]} name="room_pushdaycount" />
        </ProFormGroup>
        <ProFormText name="room_background" disabled addonAfter={<Upload
          showUploadList={false}
          customRequest={(e) => {
            handleUpload(e, "1", (res: any) => {
              updateRef.current?.setFieldsValue({
                room_background: res?.data?.attach_path,
              })
            })
          }}
        >
          <Button type="dashed">选择</Button>
        </Upload>} />

        <ProFormText.Password label="password" placeholder="不修改留空" name="room_password" />
      </ModalForm>
    </PageContainer>
  );
};

export default RoomList;
