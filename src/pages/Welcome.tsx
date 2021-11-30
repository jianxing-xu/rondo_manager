import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Image,
  message,
  Modal,
  List,
  Checkbox,
  Avatar,
} from 'antd';

import styles from './Welcome.less';
import {
  fetchRoomList,
  reqAddSong,
  reqClearMsg,
  reqOnlineList,
  reqPlayNext,
  reqQueueSongs,
  reqSearchSong,
  send,
} from '@/services/user';
import useRequest from '@ahooksjs/use-request';

const RoomCard = React.memo<any>(({ item, active }: any) => {
  return (
    <Card style={{ border: `solid 1px ${active ? 'skyblue' : 'transparent'}` }}>
      <div className={styles.card_head}>
        <h4>房间ID：{item.room_id}</h4>
        <h5>在线人数：{item.room_online}</h5>
        <Button
          onClick={() => {
            window.open(`http://106.15.137.156/rondo/#/?room=${item.room_id}`);
          }}
        >
          打开房间
        </Button>
      </div>
      <div className={styles.room_control}></div>
      <div style={{ width: '100%' }}>
        <Image
          style={{ objectFit: 'fill', width: '100%' }}
          src={process.env.BASE_API + '/badge/badge/' + item.room_id + '?time=' + Date.now()}
          alt=""
        />
      </div>
    </Card>
  );
});

export default (): React.ReactNode => {
  // const { user:_ } = useModel("@@initialState", m => ({ user: m.initialState?.user }))
  const { data, loading, run } = useRequest(() => fetchRoomList(), {
    pollingInterval: 10000,
    loadingDelay: 1000,
  });
  const [isShowAddSong, setShowAddSong] = useState(false);
  const [isShowOnline, setShowOnline] = useState(false);
  const [isShowQueue, setShowQueue] = useState(false);

  const [addGlobal, setAddGlobal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<any>(null);

  const {
    data: list,
    run: search,
    loading: fetching,
  } = useRequest((keyword) => reqSearchSong(keyword), {
    manual: true,
    debounceInterval: 300,
  });
  useEffect(() => {
    setCurrentRoom(data?.data.list?.length && data?.data.list[0]);
  }, [data]);

  const {
    data: onlineData,
    loading: onlineListLoading,
    run: fetchOnline,
  } = useRequest(reqOnlineList, {
    manual: true,
  });

  const {
    data: queue,
    loading: queueLoading,
    run: fetchQueue,
  } = useRequest(reqQueueSongs, {
    manual: true,
  });

  const next = (roomId: number) => {
    reqPlayNext(roomId).then(() => {
      message.success('操作成功');
      setTimeout(() => {
        run();
      }, 1000);
    });
  };
  const clearMsg = (roomId: number) => {
    reqClearMsg(roomId).then(() => {
      message.success('操作成功');
    });
  };

  const showAddSong = () => {
    setShowAddSong(true);
  };
  const showOnlineList = (roomId: number) => {
    fetchOnline(roomId);
    setShowOnline(true);
  };
  const showSongQueue = (roomId: string) => {
    fetchQueue(roomId);
    setShowQueue(true);
  };

  const addSong = (song: any) => {
    if (addGlobal) {
      const all = data?.data?.list?.map((item: any) => {
        return reqAddSong({ mid: song.mid, roomId: item.room_id });
      });
      Promise.all(all).then(() => {
        message.success('点歌成功');
      });
      return;
    }
    reqAddSong({ mid: song.mid, roomId: currentRoom }).then(() => {
      message.success('点歌成功');
    });
  };

  const sendMsg = (value: any) => {
    const { room_id } = currentRoom;
    send({ room_id, type: 'text', resource: value, msg: value }).then(() => {
      message.success('发送成功');
    });
  };

  return (
    <PageContainer>
      <Card>
        <Input.Search placeholder="发送全局公告" enterButton="发送" onSearch={sendMsg} />
      </Card>
      <Card
        title={
          <>
            <Button loading={loading} onClick={() => run()}>
              刷新
            </Button>
            {currentRoom ? (
              <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <Button size="small" onClick={() => next(currentRoom?.room_id)}>
                  下一首
                </Button>
                <Button size="small" onClick={() => clearMsg(currentRoom?.room_id)}>
                  清除消息
                </Button>
                <Button size="small" onClick={() => showAddSong(currentRoom?.room_id)}>
                  点歌
                </Button>
                <Button size="small" onClick={() => showOnlineList(currentRoom?.room_id)}>
                  查看在线用户
                </Button>
                <Button size="small" onClick={() => showSongQueue(currentRoom?.room_id)}>
                  查看队列歌曲
                </Button>
                <Space>
                  <Input.Search
                    onSearch={sendMsg}
                    size="small"
                    placeholder="向房间发送消息"
                    enterButton="发送"
                  />
                </Space>
              </div>
            ) : null}
          </>
        }
      >
        <Row>
          {data?.data?.list?.map((item: any) => (
            <Col
              span={8}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentRoom(item);
              }}
            >
              <RoomCard item={item} run={run} active={item?.room_id === currentRoom?.room_id} />
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title="点歌"
        key="addSong"
        visible={isShowAddSong}
        closable
        onCancel={() => setShowAddSong(false)}
      >
        <Input
          onChange={(e) => {
            search(e.target.value);
          }}
          addonAfter={
            <>
              <Checkbox value={addGlobal} onChange={(e) => setAddGlobal(e.target.checked)} />{' '}
              勾选向所有房间点歌
            </>
          }
        />
        <List
          loading={fetching}
          dataSource={list?.data || []}
          renderItem={(item: any) => (
            <List.Item
              title={item.name}
              actions={[<Button onClick={() => addSong(item)}>点歌</Button>]}
            >
              <List.Item.Meta avatar={<Avatar src={item.pic} />} title={item.name} />
            </List.Item>
          )}
        />
      </Modal>
      <Modal
        title="在线用户"
        key="online"
        visible={isShowOnline}
        onCancel={() => setShowOnline(false)}
      >
        <List
          loading={onlineListLoading}
          dataSource={onlineData?.data || []}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                description={`account: ${item?.user_account}`}
                title={item?.user_name}
                avatar={<Avatar src={`${process.env.BASE_API}/${item?.user_head}`} />}
              />
            </List.Item>
          )}
        ></List>
      </Modal>
      <Modal
        title="歌曲队列"
        key="songqueue"
        visible={isShowQueue}
        onCancel={() => setShowQueue(false)}
      >
        <List
          loading={queueLoading}
          dataSource={queue?.data || []}
          renderItem={(item: any) => (
            <List.Item>
              <List.Item.Meta
                description={`singer: ${item?.song.singer}-add user: ${item?.user.user_name}`}
                title={item?.song?.name}
                avatar={<Avatar src={`${item?.song.pic}`} />}
              />
            </List.Item>
          )}
        ></List>
      </Modal>
    </PageContainer>
  );
};
