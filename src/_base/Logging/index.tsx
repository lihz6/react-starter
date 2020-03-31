import React, { useState, useEffect, useContext } from 'react';

import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { FormProps } from 'antd/lib/form';
import { context } from '_base/Context';

import { signin, forgetPword } from './fetch';

export default function Logging() {
  const [logging, setLogging] = useState(false);
  const { setContextState } = useContext(context);
  const [form] = Form.useForm();
  useEffect(() => {
    document.title = '请登录';
  }, []);

  const handleSubmit: FormProps['onFinish'] = values => {
    setLogging(true);
    signin(values)
      .then(data => {
        setContextState(data);
        setLogging(false);
      })
      .catch(err => {
        message.error(err);
        setLogging(false);
      });
  };
  const handleForgetPword = () => {
    forgetPword(form.getFieldValue('username'))
      .then(msg => {
        message.success(msg);
      })
      .catch(err => {
        message.error(err);
      });
  };
  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        width: '100%',
      }}>
      <Form
        className="-glob-box-shadow"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        form={form}
        style={{
          backgroundColor: 'white',
          minWidth: '360px',
          padding: '48px 32px',
        }}>
        <div
          style={{
            textAlign: 'center',
            fontSize: '1.62em',
            paddingBottom: '32px',
          }}>
          · WELCOME ·
        </div>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户' }]}>
          <Input
            name="username"
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="用户"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}>
          <Input.Password
            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            name="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住登录</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" onClick={handleForgetPword}>
              忘记密码
            </a>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={logging}
            style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
