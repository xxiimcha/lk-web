"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Layout as AntLayout, Avatar, Button, Typography, Space, Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link href="/pages/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link href="/pages/settings">Settings</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" danger icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntLayout style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      {/* Sidebar (Collapsible for Responsive Design) */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{
          height: "100vh",
          background: "rgba(0, 77, 26, 0.85)", // Glassmorphism effect
          backdropFilter: "blur(10px)", // Smooth blur effect
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: "2px 0 12px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Sidebar />
      </Sider>

      {/* Main Layout for Header & Content */}
      <AntLayout style={{ marginLeft: collapsed ? 80 : 250, transition: "margin 0.3s ease-in-out" }}>
        {/* Header */}
        <Header
          style={{
            backgroundColor: "#ffffff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#004d1a" }}>Admin Panel</Title>

          <Space size="large">
            {/* User Profile Dropdown */}
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar size="large" icon={<UserOutlined />} />
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>Admin</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content Area (Scrollable inside content) */}
        <Content
          style={{
            padding: "24px",
            margin: "24px 16px",
            backgroundColor: "#ffffff",
            minHeight: "calc(100vh - 64px)",
            overflowY: "auto",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {children} {/* Page content renders here */}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
