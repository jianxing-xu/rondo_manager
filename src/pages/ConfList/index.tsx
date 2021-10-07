import { Badge, Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { fetchAllConf, reqAddConf, reqDelConf, reqUpdateConf } from '@/services/user';
import moment from 'moment';
import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-form';

const ConfList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const updateRef = useRef<ProFormInstance>();
  const [updateVisible, setUpdateVisible] = useState(false);
  const [type, setType] = useState("add");

  const saveUpdate = async (values: any) => {
    console.log(values);
    if (type == "edit") {
      await reqUpdateConf(values);
      setUpdateVisible(false);
      actionRef.current?.reload();
      message.success("修改成功");
    } else {
      await reqAddConf({ ...values });
      setUpdateVisible(false);
      actionRef.current?.reload();
      message.success("新增成功");
    }
  }
  const add = () => {
    setType("add");
    updateRef.current?.resetFields();
    setUpdateVisible(true);
  }

  const loadData = async (params: any, sort: any, filter: any) => {
    const { pageSize, current: pageNum, keyword } = params;
    const retData = {
      data: [],
      success: true,
      total: 10
    };
    try {
      const res = await fetchAllConf({ pageNum, pageSize, keyword });
      retData.total = res?.data?.total;
      retData.data = res?.data?.list;
    } catch (error) {
      retData.success = false;
    }

    return retData;
  }

  const columns: ProColumns<any>[] = [
    {
      title: "keyword",
      hideInTable: true,
      dataIndex: "keyword",
      valueType: "text",
      fieldProps: { placeholder: "Key/Value/Desc" },
    },
    {
      title: "ID",
      hideInSearch: true,
      dataIndex: 'conf_id',
    },
    {
      title: "Key",
      hideInSearch: true,
      dataIndex: 'conf_key',
      ellipsis: true,
    },
    {
      title: "Value",
      hideInSearch: true,
      dataIndex: 'conf_value',
      ellipsis: true,
    },
    {
      title: "Description",
      hideInSearch: true,
      dataIndex: 'conf_desc'
    },
    {
      title: "Status",
      hideInSearch: true,
      dataIndex: 'conf_status',
      render: (dom, record, index, action) => {
        return <Badge color={record.conf_status === 0 ? "green" : "red"} />
      },
    },
    {
      title: "Create time",
      hideInSearch: true,
      dataIndex: 'conf_createtime',
      render: (dom, record, index, action) => {
        return moment(record.conf_createtime * 1000).format("YYYY/MM/DD")
      },
    },
    {
      title: "Update time",
      hideInSearch: true,
      dataIndex: 'conf_updatetime',
      render: (dom, record, index, action) => {
        return moment(record.conf_updatetime * 1000).format("YYYY/MM/DD")
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      render: (_, row, index) => [
        <a key="del" onClick={async () => {
          await reqDelConf(row.conf_id);
          message.success("删除成功");
          actionRef.current?.reload();
        }}>
          删除
        </a>,
        <a key="edit" onClick={() => {
          setType("edit");
          setUpdateVisible(true);
          updateRef.current?.setFieldsValue({ ...row })
        }}>编辑</a>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="conf_id"
        request={loadData}
        actionRef={actionRef}
        columns={columns}
        toolBarRender={() => ([
          <Button onClick={add}>新增</Button>
        ])}
      />
      <ModalForm
        title={type == "add" ? "Add Conf" : "Update Conf"}
        width="500px"
        formRef={updateRef}
        visible={updateVisible}
        onVisibleChange={setUpdateVisible}
        onFinish={saveUpdate}>
        <ProFormText name="conf_id" hidden />
        <ProFormText label="Key" rules={[{ required: true }]} name="conf_key" />
        <ProFormText label="Value" rules={[{ required: true }]} name="conf_value" />
        <ProFormText label="Desc" rules={[{ required: true }]} name="conf_desc" />
      </ModalForm>
    </PageContainer>
  );
};

export default ConfList;
