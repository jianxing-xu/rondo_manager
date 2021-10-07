import {
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { useIntl, FormattedMessage, useModel, history } from 'umi';

import styles from './index.less';
import { fetchUserInfo, reqLogin, sendMail } from '@/services/user';



const Login: React.FC = () => {
  const { state, set } = useModel("@@initialState", m => ({ state: m.initialState, set: m.setInitialState }))
  const [submitting, setSubmitting] = useState(false);
  const intl = useIntl();
  const loginForm = useRef<ProFormInstance>();


  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    reqLogin(values).then(data => {
      fetchUserInfo().then(user => {
        set({...state, user})
        history.replace("/");
      }).catch(e => location.reload())
    }).catch(e => setSubmitting(false))
  };
  const sendCaptcha = (account: string) => {
    console.log("MAIL: ", account);
    return sendMail(account);
  }
  return (
    < div className={styles.container} >
      <div className={styles.content}>
        <div className={styles.main}>
          <ProForm
            formRef={loginForm}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              await handleSubmit(values);
            }}
          >
            <>
              <ProFormCaptcha
                name="account"
                phoneName="account"
                onGetCaptcha={sendCaptcha}
                captchaProps={{
                  size: 'large',
                }}
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="用户名/Email/ID"
                rules={[{ required: true, message: "你是谁？" },]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="密码/邮箱验证码"
                rules={[{ required: true, message: "???????" }]}
              />
            </>
            <div style={{ marginBottom: 24 }}>
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox>
              <a style={{ float: 'right' }}>
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div>
          </ProForm>
        </div>
      </div>
    </div >
  );
};

export default Login;
