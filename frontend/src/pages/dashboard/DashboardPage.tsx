import { Card, Col, Row, Statistic, Typography, theme } from 'antd';
import { UserOutlined, RiseOutlined, SafetyOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/auth.store';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { token } = theme.useToken();

  const stats = [
    { title: 'Người dùng', value: 128, icon: <UserOutlined />, color: token.colorPrimary },
    { title: 'Tăng trưởng', value: '24%', icon: <RiseOutlined />, color: token.colorSuccess },
    { title: 'Bảo mật', value: '100%', icon: <SafetyOutlined />, color: token.colorWarning },
    { title: 'Uptime', value: '99.9%', icon: <ClockCircleOutlined />, color: token.colorError },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          👋 Xin chào, {user?.name}!
        </Title>
        <Text type="secondary">{dayjs().format('dddd, DD/MM/YYYY')}</Text>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card>
              <Statistic
                title={s.title}
                value={s.value}
                prefix={<span style={{ color: s.color, marginRight: 4 }}>{s.icon}</span>}
                valueStyle={{ color: s.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Hoạt động gần đây" style={{ height: 320 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Người dùng mới đăng ký', 'Cập nhật hồ sơ', 'Đăng nhập từ IP mới'].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <Text>{item}</Text>
                  <Text type="secondary">{dayjs().subtract(i, 'hour').format('HH:mm')}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Thông tin tài khoản" style={{ height: 320 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><Text type="secondary">Email:</Text><br /><Text strong>{user?.email}</Text></div>
              <div><Text type="secondary">Vai trò:</Text><br /><Text strong style={{ textTransform: 'capitalize' }}>{user?.role}</Text></div>
              <div><Text type="secondary">Trạng thái:</Text><br /><Text strong style={{ color: 'green' }}>Hoạt động</Text></div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
