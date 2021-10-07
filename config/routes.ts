export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/songs',
    name: 'song-list',
    icon: 'crown',
    component: './SongList',
  },
  {
    name: 'user-list',
    icon: 'table',
    path: '/userlist',
    component: './UserList',
  },
  {
    name: 'room-list',
    icon: 'table',
    path: '/roomlist',
    component: './RoomList',
  },
  {
    name: 'message-list',
    icon: 'message',
    path: '/messagelist',
    component: './MessageList',
  },
  {
    name: 'conf-list',
    icon: 'message',
    path: '/conflist',
    component: './ConfList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
