import { uploadImg } from "@/services/user";
import { message } from "antd";

export const MyConfig = {
  visitor: "1d40dc0b40000743d69ba671d8a418250f66422df9c61e332deeec7c15a2dade"
}
export const getToken = () => {
  return localStorage.getItem("token") || MyConfig.visitor;
}


const messageTipPool = (time = 300) => {
  const pool: any[] = [];
  let preMsg = "";
  let msgType: any = "";
  let timer: any;
  const clear = (msg: string) => {
    console.log(preMsg);
    if (timer) {
      if (msg == preMsg || preMsg == "") {
        clearTimeout(timer);
      }
      preMsg = msg;
    }
    timer = setTimeout(() => {
      message.open({ type: msgType, content: msg, duration: 2, });
      pool.length = 0;
    }, time)
  }
  return function (msg: string, type: any = "error") {
    msgType = type;
    pool.push(msg);
    clear(msg);
  }
}
export const msgTip = messageTipPool();



// 处理 Upload 自定义上传图片
export const handleUpload = (e: any, type: any, callback: Function) => {
  if (["image/jpeg", "image/png", "image/gif"].includes(e?.file?.type)) {
    const hide = message.loading({ content: "上传中..." });
    uploadImg({ file: e.file, type }).then((res: any) => {
      hide();
      callback(res);
    });
  }
};
