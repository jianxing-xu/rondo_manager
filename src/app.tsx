import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { RequestConfig, RunTimeLayoutConfig, history } from 'umi';
import Footer from '@/components/Footer';
import { getToken, msgTip, MyConfig } from './utils';
import { fetchUserInfo } from './services/user';
import { Avatar, message } from 'antd';

// const isDev = process.env.NODE_ENV === 'development';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/** 初始化状态 */
export async function getInitialState(): Promise<{ settings?: Partial<LayoutSettings>; user?: any }> {
  let data = null;
  try {
    data = await fetchUserInfo();
  } catch (error) {
    history.replace("/user/login");
  }
  return {
    settings: {},
    user: data['data']
  };
}

/** 设置请求/响应拦截器 */
const authHeaderInterceptor = (url: string, options: any) => {
  options.headers["token"] = getToken();
  console.log("REQUEST_INTERCEPTOR: " + url, options);
  return {
    url: `${url}`,
    options: { ...options, interceptors: true },
  };
};
const responseInterceptor = async (response: Response, options: any) => {
  const data = await response.json().then(data => data);
  const code = data['code'];
  if (response.status == 200 && code == 1000) {
    if (data?.data?.token) {
      localStorage.setItem("token", data?.data?.token ?? "");
    }
    return data;
  }
  return Promise.reject({ ...data, httpCode: response.status });
}
export const request: RequestConfig = {
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [responseInterceptor],
  prefix: process.env.BASE_API,
  errorConfig: {
    adaptor: (resData, ctx) => ({ success: resData?.code === 1000 })
  },
  errorHandler: function (error) {
    const errData = { ...error };
    console.log("ERROR_HANDLE: ", errData);
    // 没有HttpCode代表没有连接网络
    if (!!!errData['httpCode']) {
      message.error("网络错误");
      return Promise.reject(errData)
    }
    // 处理后端自定义 code 错误
    if (errData['httpCode'] == 400 && !!errData['code']) {
      switch (errData['code']) {
        case 1055:
          msgTip(errData['msg']);
          return Promise.reject(errData);
        default:
          msgTip(errData['msg']);
          return Promise.reject(errData);
      }
    }
    // 处理 HttpCode 错误
    switch (errData['httpCode']) {
      case 403:
        msgTip(errData['msg']);
        localStorage.removeItem("token");
        return history.replace("/user/login");
      case 500:
        msgTip(errData['msg']);
        return Promise.reject(errData);
      default:
        return Promise.reject(errData);
    }
  }
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  const user = initialState?.user;
  console.log(user);
  return {
    footerRender: () => <Footer />,
    onPageChange: ({ pathname }: any) => {
      const token = getToken();
      if (!!!token || token === MyConfig.visitor) {
        if (pathname === "/user/login") return;
        history.replace("/user/login");
      }
    },
    menuHeaderRender: () => (<>
      <div>List</div>
    </>),
    headerTitleRender: () => <div style={{ color: '#fff' }}>Rondo</div>,
    rightContentRender: () => <div><Avatar src={`${process.env.BASE_API}${user?.user_head ?? '--'}`} /></div>,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
