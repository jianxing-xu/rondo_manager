import { Avatar, Badge, message, Tooltip } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { delMsgsByIds, fetchMessageList } from '@/services/user';
import moment from 'moment';

const MessageList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const loadData = async (params: any, sort: any, filter: any) => {
    const { pageSize, current: pageNum, keyword } = params;
    const retData = {
      data: [],
      success: true,
      total: 10
    };
    try {
      const res = await fetchMessageList({ pageNum, pageSize, keyword });
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
      fieldProps: { placeholder: "ID/UserID/Content/Type" },
    },
    {
      title: "ID",
      hideInSearch: true,
      dataIndex: 'message_id',
    },
    {
      title: "Content",
      hideInSearch: true,
      dataIndex: 'message_content',
      ellipsis: true,
      width: 200,
      render: (a, row, c, d) => {
        return <Tooltip title={row.message_type == "text" ? row.message_content : <img width={200} src={row.message_content} />}>{
          row.message_type == "text" ? row.message_content : <Avatar src={row.message_content} />
        }</Tooltip>
      }
    },
    {
      title: "User",
      hideInSearch: true,
      dataIndex: 'message_user',
      ellipsis: true,
    },
    {
      title: "To",
      hideInSearch: true,
      dataIndex: 'message_to'
    },
    {
      title: "Type",
      hideInSearch: true,
      dataIndex: 'message_type',
    },
    {
      title: "Status",
      hideInSearch: true,
      dataIndex: 'message_status',
      render: (dom, record, index, action) => {
        return <Badge color={record.message_status === 0 ? "green" : "red"} />
      },
    },
    {
      title: "Create time",
      hideInSearch: true,
      dataIndex: 'user_createtime',
      render: (dom, record, index, action) => {
        return moment(record.message_createtime * 1000).format("YYYY/MM/DD")
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      render: (_, row, index) => [
        <a key={index} onClick={async () => {
          await delMsgsByIds(row.message_id);
          message.success("删除成功");
          actionRef.current?.reload();
        }}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="message_id"
        request={loadData}
        actionRef={actionRef}
        columns={columns}
      />
    </PageContainer>
  );
};

export default MessageList;
