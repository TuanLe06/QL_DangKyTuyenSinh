import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import { User } from '../../types';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const res = await authApi.login(values);
      const { user, token } = res.data.data as { user: User; token: string };
      setAuth(user, token);
      message.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      message.error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Card style={{ width: 420, boxShadow: '0 20px 60px rgba(0,0,0,.3)', borderRadius: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🚀</div>
          <Title level={2} style={{ margin: 0 }}>Đăng Nhập</Title>
          <Text type="secondary">Chào mừng bạn trở lại!</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ height: 44 }}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Chưa có tài khoản? </Text>
          <Link to="/register">Đăng ký ngay</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
