import { request } from 'umi';
export type SearchParam = {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
};
export const defaultSearchParam: SearchParam = {
  pageNum: 1,
  pageSize: 20,
  keyword: '',
};

// 拉取用户信息
export const fetchUserInfo = () => {
  return request('/user/info', {
    method: 'POST',
  });
};
// 登录
export const reqLogin = (data: { account: string; password: string }) => {
  return request('/user/admin/login', {
    method: 'POST',
    data,
  });
};

// 查询所有用户
export const fetchUserList = (params: SearchParam = defaultSearchParam) => {
  return request('/user/list', {
    params,
  });
};

// 更新用户信息
export const updateUserInfo = (data: any) => {
  return request('/user/updateUser', {
    method: 'POST',
    data,
  });
};

// send mail
export const sendMail = (mail: string) => {
  console.log(mail);
  return request(`/common/sendMail/${mail}`);
};

/**
 * 歌曲API
 */

// 获取所有歌曲
export const getAllSongs = (params: SearchParam = defaultSearchParam) => {
  return request('/song/list', {
    method: 'GET',
    params,
  });
};
// 删除歌曲
export const reqDelSongs = (ids: string) => {
  return request(`/song/delSongs/${ids}`, {
    method: 'DELETE',
  });
};

/** 获取所有房间 */
export const fetchRoomList = (params: SearchParam = defaultSearchParam) => {
  return request('/room/list', { params });
};

export const updateRoom = (data: any) => {
  return request('/room/update', {
    method: 'POST',
    data,
  });
};

/** Message API */
// 获取所有消息
export const fetchMessageList = (params: SearchParam = defaultSearchParam) => {
  return request('/message/all', {
    params,
  });
};
// 根据id删除消息
export const delMsgsByIds = (ids: string) => {
  return request('/message/delMsgs/' + ids, {
    method: 'DELETE',
  });
};

/** Conf 管理 API */
// 获取所有配置
export const fetchAllConf = (params: SearchParam = defaultSearchParam) => {
  return request('/conf/all', {
    params,
  });
};
// 添加配置
export type Conf = {
  key: string;
  value: string;
  desc: string;
};
export const reqAddConf = (data: Conf) => {
  return request('/conf/add', {
    method: 'POST',
    params: data,
  });
};
export const reqDelConf = (id: string) => {
  return request('/conf/del', {
    method: 'POST',
    params: { id },
  });
};
export const reqUpdateConf = (params: Conf) => {
  return request('/conf/update', {
    method: 'POST',
    params,
  });
};

/** Dashboard API */
// 下一首
export const reqPlayNext = (roomId: number) => {
  return request('/song/next/' + roomId);
};
// 清除消息
export const reqClearMsg = (roomId: number) => {
  return request('/message/clear/' + roomId, {
    method: 'DELETE',
  });
};
// 获取在线列表
export const reqOnlineList = (roomId: number) => {
  return request(`/user/online/${roomId}/yes`);
};
// 搜索歌曲
export const reqSearchSong = (keyword: string) => {
  return request('/song/search', {
    params: { keyword },
  });
};
// 点歌
export const reqAddSong = (data: { roomId: string; mid: string; atUser?: string }) => {
  return request('/song/add', {
    method: 'POST',
    data,
  });
};
// queue songs
export const reqQueueSongs = (roomId: string) => {
  return request('/song/queue/' + roomId);
};

/** 上传图片 { file } */
interface IUploadImgParam {
  file: File;
  type: string; //0 头像   1: 聊天图片
}
export const uploadImg = (param: IUploadImgParam) => {
  const form = new FormData();
  form.append('file', param.file);
  form.append('type', param.type);
  return request('/attach/uploadImg', {
    method: 'POST',
    data: form,
  });
};

/** 发送消息 */
export interface IAtUser {
  // 参数字段
  user_id: number; //: 1,
  user_name: string; //: "机器人"
  // 前台处理at字段
  user_head?: string; // 头像
  type?: number; //0:送歌@  1:聊天@
}
interface ISendParam {
  room_id: string; //: 888,
  atUser?: IAtUser | null;
  type: string; //: "img",
  where?: string; //: "channel",
  msg?: string; //: "hello <script>alert('Xss来了')</script>",
  resource?: string; //: "/res/bg.png"
}
export const send = (data: ISendParam) => {
  return request('/message/send', {
    method: 'post',
    data,
  });
};
