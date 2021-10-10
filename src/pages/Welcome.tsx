import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, InputNumber, Row, Space, Image, message, Modal, List, Spin, Checkbox, Avatar } from 'antd';
import { useIntl, useModel } from 'umi';
import styles from './Welcome.less';
import { fetchRoomList, reqAddSong, reqClearMsg, reqOnlineList, reqPlayNext, reqQueueSongs, reqSearchSong } from '@/services/user';
import useRequest from '@ahooksjs/use-request';



const RoomCard = React.memo<any>(({ item, run, showAddSong, showOnlineList, showSongQueue }: any) => {
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
        <Button size="small" onClick={() => showAddSong(item.room_id)}>点歌</Button>
        <Button size="small" onClick={() => showOnlineList(item.room_id)}>查看在线用户</Button>
        <Button size="small" onClick={() => showSongQueue(item.room_id)}>查看队列歌曲</Button>
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
});


export default (): React.ReactNode => {
  const { user } = useModel("@@initialState", m => ({ user: m.initialState?.user }))
  const { data, loading, run } = useRequest(() => fetchRoomList(), {
    pollingInterval: 10000,
    loadingDelay: 1000
  });
  const [isShowAddSong, setShowAddSong] = useState(false);
  const [isShowOnline, setShowOnline] = useState(false);
  const [isShowQueue, setShowQueue] = useState(false);

  const [addGlobal, setAddGlobal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");

  const { data: list, run: search, loading: fetching } = useRequest((keyword) => reqSearchSong(keyword), {
    manual: true,
    debounceInterval: 300
  });

  const { data: onlineData, loading: onlineListLoading, run: fetchOnline } = useRequest(reqOnlineList, {
    manual: true
  })

  const { data: queue, loading: queueLoading, run: fetchQueue } = useRequest(reqQueueSongs, {
    manual: true
  })

  const showAddSong = (roomId: string) => {
    setCurrentRoom(roomId);
    setShowAddSong(true);
  }
  const showOnlineList = (roomId: number) => {
    fetchOnline(roomId);
    setShowOnline(true);
  }
  const showSongQueue = (roomId: string) => {
    fetchQueue(roomId);
    setShowQueue(true);
  }

  const addSong = (song: any) => {
    if (addGlobal) {
      const all = data?.data?.list?.map((item:any) => {
        return reqAddSong({mid: song.mid, roomId: item.room_id});
      })
      Promise.all(all).then(res => {
        message.success("点歌成功");
      })
      return;
    }
    reqAddSong({ mid: song.mid, roomId: currentRoom }).then(res => {
      message.success("点歌成功");
    })
  }



  return (
    <PageContainer>
      <Card>
        <Input.Search placeholder="发送全局公告" enterButton="发送" />
      </Card>
      <Card title={<Button loading={loading} onClick={() => run()}>刷新</Button>}>
        <Row >
          {
            data?.data?.list?.map((item: any) => (
              <RoomCard item={item} run={run} showAddSong={showAddSong} showOnlineList={showOnlineList} showSongQueue={showSongQueue} />
            ))
          }
        </Row>
      </Card>

      <Modal title="点歌" key="addSong" visible={isShowAddSong} closable onCancel={setShowAddSong.bind(this, false)}>
        <Input onChange={e => {
          search(e.target.value);
        }} addonAfter={<><Checkbox value={addGlobal} onChange={e => setAddGlobal(e.target.checked)} /> 勾选向所有房间点歌</>} />
        <List
          loading={fetching}
          dataSource={list?.data || []}
          renderItem={(item: any) => (
            <List.Item title={item.name} actions={[<Button onClick={addSong.bind(this,item)}>点歌</Button>]}>
              <List.Item.Meta avatar={<Avatar src={item.pic}/>} title={item.name} />
            </List.Item>
          )}
        />
      </Modal>
      <Modal title="在线用户" key="online" visible={isShowOnline} onCancel={setShowOnline.bind(this,false)}>
        <List loading={onlineListLoading} dataSource={onlineData?.data || []} renderItem={(item: any) => <List.Item>
          <List.Item.Meta description={`account: ${item?.user_account}`} title={item?.user_name} avatar={<Avatar src={`${process.env.BASE_API}/${item?.user_head}`} />} />
        </List.Item>}>
        </List>
      </Modal>
      <Modal title="歌曲队列" key="songqueue" visible={isShowQueue} onCancel={setShowQueue.bind(this,false)}>
        <List loading={queueLoading} dataSource={queue?.data || []} renderItem={(item: any) => <List.Item>
          <List.Item.Meta description={`singer: ${item?.song.singer}-add user: ${item?.user.user_name}`} title={item?.song?.name} avatar={<Avatar src={`${item?.song.pic}`} />} />
        </List.Item>}>
        </List>
      </Modal>
    </PageContainer >
  );
};
