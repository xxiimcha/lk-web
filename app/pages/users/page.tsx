"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Table, Modal, Button, Typography, Card, Tag, Descriptions, Avatar, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserOutlined, MailOutlined, SafetyOutlined, BranchesOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  plantsInProgress?: number;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users?role=user");
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Table Columns
  const columns: ColumnsType<User> = [
    {
      title: "Profile",
      dataIndex: "name",
      key: "profile",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size="large" icon={<UserOutlined />} />
          <span className="font-semibold text-gray-800">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <Text>{email}</Text>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "volcano" : "blue"}>{role.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Plants In Progress",
      dataIndex: "plantsInProgress",
      key: "plantsInProgress",
      render: (plants: number) =>
        plants > 0 ? (
          <Tag color="green">
            <BranchesOutlined className="animate-pulse" /> {plants} Active
          </Tag>
        ) : (
          <Tag color="red">None</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button type="primary" shape="round" onClick={() => openModal(record)}>
            View
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
        <Card bordered={false} className="shadow-lg rounded-xl w-full max-w-5xl">
          <div className="flex justify-between items-center">
            <Title level={2} className="text-gray-800">User Management</Title>
            <Text type="secondary">Manage all registered users efficiently.</Text>
          </div>

          {/* Users Table */}
          <div className="mt-6">
            <Table
              columns={columns}
              dataSource={users}
              rowKey="_id"
              pagination={{ pageSize: 8 }}
              className="rounded-lg shadow-sm"
            />
          </div>
        </Card>
      </div>

      {/* User Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <Avatar size={50} icon={<UserOutlined />} />
            <Title level={4} className="mb-0">{selectedUser?.name}</Title>
          </div>
        }
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="close" type="primary" onClick={closeModal}>
            Close
          </Button>,
        ]}
        centered
        width={550} // ✅ Optimized modal width
      >
        {selectedUser && (
          <Card bordered={false} className="shadow-md rounded-md bg-gray-50">
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Name">
                <UserOutlined style={{ marginRight: 8 }} />
                {selectedUser.name}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                <MailOutlined style={{ marginRight: 8 }} />
                {selectedUser.email}
              </Descriptions.Item>

              <Descriptions.Item label="Role">
                <SafetyOutlined style={{ marginRight: 8 }} />
                <Tag color={selectedUser.role === "admin" ? "volcano" : "blue"}>
                  {selectedUser.role.toUpperCase()}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Plants In Progress">
                {selectedUser.plantsInProgress && selectedUser.plantsInProgress > 0 ? (
                  <Tag color="green">
                    <BranchesOutlined className="animate-bounce" /> {selectedUser.plantsInProgress} Active
                  </Tag>
                ) : (
                  <Tag color="red">None</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>
    </Layout>
  );
};

export default Users;
