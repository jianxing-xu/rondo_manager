import { Badge, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { fetchUserList, updateUserInfo } from '@/services/user';
import moment from 'moment';

const UserList: React.FC = () => {
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
      const res = await fetchUserList({ pageNum, pageSize, keyword });
      retData.total = res?.data?.total;
      retData.data = res?.data?.list;
    } catch (error) {
      retData.success = false;
    }

    return retData;
  }
  const save = async (values: any) => {
    try {
      await updateUserInfo(values);
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
      fieldProps: { placeholder: "ID/Account/Username" },
    },
    {
      title: "User ID",
      hideInSearch: true,
      dataIndex: 'user_id',
      editable: (text, record, index) => false
    },
    {
      title: "Account",
      hideInSearch: true,
      dataIndex: 'user_account',
      editable: (text, record, index) => false,
      render: (dom, record, index, action) => {
        return record.user_account ?? dom;
      },
    },
    {
      title: "Username",
      hideInSearch: true,
      dataIndex: 'user_name',
      render: (dom, record, index, action) => {
        return record.user_name ?? dom;
      },
    },
    {
      title: "IP",
      hideInSearch: true,
      dataIndex: 'user_ipreg',
      editable: (text, record, index) => false,
      render: (dom, record, index, action) => {
        return record.user_ipreg ?? dom;
      },
    },
    {
      title: "Sex",
      hideInSearch: true,
      dataIndex: 'user_sex',
      width: 50,
      editable: (text, record, index) => false,
      render: (dom, record, index, action) => {
        return record.user_sex == 0 ? "Girl" : "Boy";
      },
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
      title: "Remark",
      hideInSearch: true,
      dataIndex: 'user_remark',
      copyable: true,
      ellipsis: true,
    },
    {
      title: "Touchtip",
      hideInSearch: true,
      dataIndex: 'user_touchtip',
      copyable: true,
      ellipsis: true
    },
    {
      title: "Status",
      hideInSearch: true,
      dataIndex: 'user_status',
      width: 60,
      render: (dom, record, index, action) => {
        return <Badge color={record.user_status === 0 ? "green" : "red"} />
      },
    },
    {
      title: "Vip",
      hideInSearch: true,
      dataIndex: 'user_vip',
      width: 50,
      valueType: "select",
      render: (dom, record, index, action) => {
        return <Badge color={record.user_vip === 1 ? "green" : "red"} />
      },
    },
    {
      title: "Role",
      hideInSearch: true,
      width: 70,
      dataIndex: 'user_role',
      valueType: "select",
      valueEnum: {
        admin: {
          text: "Admin",
          status: 1
        },
        normal: {
          text: "Normal",
          status: 0
        }
      },
      render: (dom, record, index, action) => {
        return record.user_role === 1 ? "Admin" : "Normal";
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
        rowKey="user_id"
        request={loadData}
        actionRef={actionRef}
        columns={columns}
      />
      <ModalForm
        title="Update User"
        width="400px"
        formRef={updateRef}
        visible={updateVisible}
        onVisibleChange={handleModalVisible}
        onFinish={save}>
        <ProFormText hidden rules={[{ required: true }]} name="user_id" />
        <ProFormText label="user_name" rules={[{ required: true }]} name="user_name" />
        <ProFormSelect label="user_sex" rules={[{ required: true }]} name="user_sex" options={[{ label: "Boy", value: 1 }, { label: "Girl", value: 0 }]} />
        <ProFormText label="user_remark" rules={[{ required: true }]} name="user_remark" />
        <ProFormText label="user_touchtip" rules={[{ required: true }]} name="user_touchtip" />
        <ProFormSelect label="user_status" rules={[{ required: true }]} name="user_status" options={[{ label: "Disable", value: 1 }, { label: "Normal", value: 0 }]} />
        <ProFormSelect label="user_vip" rules={[{ required: true }]} name="user_vip" options={[{ label: "Yes", value: 1 }, { label: "No", value: 0 }]} />
        <ProFormSelect label="user_role" rules={[{ required: true }]} name="user_role" options={[{ label: "Admin", value: 1 }, { label: "Normal", value: 0 }]} />
        <ProFormText.Password label="password" placeholder="不修改留空" name="user_password" />
      </ModalForm>
    </PageContainer>
  );
};

export default UserList;
