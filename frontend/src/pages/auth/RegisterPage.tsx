import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    try {
      await authApi.register(values);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      message.error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Card style={{ width: 420, boxShadow: '0 20px 60px rgba(0,0,0,.3)', borderRadius: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✨</div>
          <Title level={2} style={{ margin: 0 }}>Đăng Ký</Title>
          <Text type="secondary">Tạo tài khoản mới</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item name="name" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ height: 44 }}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Đã có tài khoản? </Text>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
