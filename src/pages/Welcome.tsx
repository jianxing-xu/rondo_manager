import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, InputNumber, Row, Space, Image, message } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from './Welcome.less';
import { fetchRoomList, reqClearMsg, reqOnlineList, reqPlayNext } from '@/services/user';
import useRequest from '@ahooksjs/use-request';



const RoomCard: React.FC<any> = ({ item, run }) => {
  const next = (roomId: number) => {
    reqPlayNext(roomId).then(() => {
      message.success("操作成功");
      setTimeout(() => {
        run();
      }, 1000)
    })
  }
  const clearMsg = (roomId: number) => {
    reqClearMsg(roomId).then(() => {
      message.success("操作成功");
    })
  }
  return <Col span={8}>
    <Card>
      <div className={styles.card_head}>
        <h4>房间ID：{item.room_id}</h4>
        <h5>在线人数：{item.room_online}</h5>
      </div>
      <div className={styles.room_control}>
        <Button size="small" onClick={() => next(item.room_id)} >下一首</Button>
        <Button size="small" onClick={() => clearMsg(item.room_id)}>清除消息</Button>
        <Button size="small" >点歌</Button>
        <Button size="small" >查看在线用户</Button>
        <Button size="small" >查看队列歌曲</Button>
        <Space>
          <InputNumber size="small" style={{ width: 100 }} placeholder="房间音量" />
          <Button size="small">发送音量调整</Button>
        </Space>
        <Space>
          <Input.Search size="small" placeholder="向房间发送消息" enterButton="发送" />
        </Space>
      </div>
      <div style={{ width: "100%" }}>
        <Image style={{ objectFit: "fill", width: "100%" }} src={process.env.BASE_API + '/badge/badge/' + item.room_id + "?time=" + Date.now()} alt="" />
      </div>
    </Card>
  </Col>
}


export default (): React.ReactNode => {
  const { user } = useModel("@@initialState", m => ({ user: m.initialState?.user }))
  const { data, loading, run } = useRequest(() => fetchRoomList(), {
    pollingInterval: 10000,
    loadingDelay: 1000
  });
  // const { data: onlineData, loading: onlineListLoading, run: fetchOnline } = useRequest(() => onlineList(888), {
  //   manual: true
  // })
  // const { loading: nextLoading, run: reqNext } = useRequest(() => reqPlayNext(888), {
  //   manual: true
  // })



  return (
    <PageContainer>
      <Card>
        <Input.Search placeholder="发送全局公告" enterButton="发送" />
      </Card>
      <Card title={<Button loading={loading} onClick={() => run()}>刷新</Button>}>
        <Row >
          {
            data?.data?.list?.map((item: any) => (
              <RoomCard item={item} run={run} />
            ))
          }
        </Row>
      </Card>

    </PageContainer >
  );
};
