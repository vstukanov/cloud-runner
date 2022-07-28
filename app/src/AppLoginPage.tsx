import React, { useState } from 'react';
import { Button, Card, Form, Input, Layout, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import _ from 'lodash';

import { useSession } from './providers/SessionProvider';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  layout: {
    height: '100vh',
    padding: 20,
  },

  layoutContent: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitFormItem: {
    paddingTop: 20,
  },

  submitButton: {
    width: '100%',
  },

  formCard: {
    width: 400,
  },

  title: {
    textAlign: 'center',
    paddingBottom: 12,
  },
});

type LoginFormData = {
  email: string;
  password: string;
};

export function AppLoginPage() {
  const [isLoading, setLoading] = useState(false);

  const classes = useStyles();
  const session = useSession();

  async function performLogin(formValues: LoginFormData) {
    setLoading(true);
    try {
      await session.login(formValues.email, formValues.password);
    } catch (e) {
      const status = _.get(e, 'response.status');

      if (status === 401) {
        message.error('Incorrect email or password');
      } else {
        message.error('Ops... something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout className={classes.layout}>
      <Layout.Content className={classes.layoutContent}>
        <Card className={classes.formCard}>
          <h1 className={classes.title}>ACCOUNT LOGIN</h1>

          <Form name="login-form" onFinish={performLogin} size="large">
            <Form.Item
              name="email"
              required
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              required
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item className={classes.submitFormItem}>
              <Button
                type="primary"
                loading={isLoading}
                htmlType="submit"
                className={classes.submitButton}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    </Layout>
  );
}
