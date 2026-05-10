import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Popconfirm, message, Typography, Switch } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { userApi } from '../../api/user.api';
import { User } from '../../types';
import dayjs from 'dayjs';

const { Title } = Typography;

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await userApi.getAll(page, pagination.limit);
      setUsers(res.data.data);
      setPagination((p) => ({ ...p, total: res.data.pagination.total, page }));
    } catch {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number) => {
    try {
      await userApi.delete(id);
      message.success('Đã xóa người dùng');
      fetchUsers(pagination.page);
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const handleToggleActive = async (id: number, is_active: boolean) => {
    try {
      await userApi.update(id, { is_active: !is_active });
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: !is_active } : u));
    } catch {
      message.error('Cập nhật thất bại');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'} style={{ textTransform: 'capitalize' }}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active: boolean, record: User) => (
        <Switch checked={active} onChange={() => handleToggleActive(record.id, active)} size="small" />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" type="default">Sửa</Button>
          <Popconfirm title="Xóa người dùng này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý người dùng</Title>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          total: pagination.total,
          current: pagination.page,
          pageSize: pagination.limit,
          onChange: fetchUsers,
          showTotal: (total) => `Tổng ${total} người dùng`,
        }}
      />
    </div>
  );
};

export default UsersPage;
