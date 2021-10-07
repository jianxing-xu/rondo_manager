import { Avatar, message } from 'antd';
import React, { useRef, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { getAllSongs, reqDelSongs } from '@/services/user';
import moment from 'moment';

const SongList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const loadData = async (params: any, sort: any, filter: any) => {
    const { pageSize, current: pageNum, keyword } = params;
    const retData = {
      data: [],
      success: true,
      total: 10
    };
    try {
      const res = await getAllSongs({ pageNum, pageSize, keyword });
      retData.total = res?.data?.total;
      retData.data = res?.data?.list;
    } catch (error) {
      retData.success = false;
    }

    return retData;
  }
  const delSongs = useCallback(async (id: string) => {
    await reqDelSongs(id);
    message.success("删除成功");
    actionRef.current?.reload();
  }, [])

  const columns: ProColumns<any>[] = [
    {
      title: "keyword",
      hideInTable: true,
      dataIndex: "keyword",
      valueType: "text",
      fieldProps: { placeholder: "SongName/ID/SongUser/Singer" },
    },
    {
      title: "ID",
      hideInSearch: true,
      dataIndex: 'song_id',
      editable: (text, record, index) => false
    },
    {
      title: "Mid",
      hideInSearch: true,
      dataIndex: 'song_mid',
      editable: (text, record, index) => false
    },
    {
      title: "Song name",
      hideInSearch: true,
      dataIndex: 'song_name',
      ellipsis: true,
    },
    {
      title: "Singer",
      hideInSearch: true,
      dataIndex: 'song_singer',
      ellipsis: true,
    },
    {
      title: "Picker ID",
      hideInSearch: true,
      dataIndex: 'song_user',
      ellipsis: true,
    },
    {
      title: "Pic",
      hideInSearch: true,
      dataIndex: 'song_pic',
      render: (dom, record, index, action) => {
        return <Avatar size="large" src={record.song_pic} />
      },
    },
    {
      title: "Week Play",
      hideInSearch: true,
      dataIndex: 'song_week',
      ellipsis: true,
    },
    {
      title: "Total Play",
      hideInSearch: true,
      dataIndex: 'song_play',
      ellipsis: true,
    },
    {
      title: "CreateAt",
      hideInSearch: true,
      dataIndex: 'song_createtime',
      ellipsis: true,
      render: (_, row, __, ___) => moment(row.song_createtime).format("YYYY/MM/DD")
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width: 150,
      render: (_, row, index) => (
        <a key={index} onClick={() => delSongs(row.song_id)}>
          删除
        </a>
      )
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="song_id"
        request={loadData}
        actionRef={actionRef}
        columns={columns}
      />
    </PageContainer>
  );
};

export default SongList;
