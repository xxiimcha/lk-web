"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Layout as AntLayout, Typography, Space, Dropdown, MenuProps, Spin, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import ProfileModal from "./ProfileModal";

const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No authentication token found. Redirecting to login...");
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    message.success("Logged out successfully!");
    router.push("/");
  };

  const handleProfileUpdate = (updatedUser: { name: string; email: string }) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...updatedUser };
    });
    message.success("Profile updated successfully!");
  };

  const handleOpenProfileModal = () => {
    setProfileModalVisible(true);
  };

  // ✅ Fixed Dropdown Menu for Ant Design v5
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Edit Profile",
      onClick: handleOpenProfileModal,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout
      style={{
        minHeight: "100vh",
        backgroundImage: `url('/background.jpg')`, // ✅ Add your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* ✅ Semi-transparent Overlay for Readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.7)", // ✅ Adjust opacity here
          backdropFilter: "blur(10px)", // ✅ Blur effect
          zIndex: 1, // ✅ Keeps it above background but below content
        }}
      ></div>

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{
          height: "100vh",
          background: "rgba(0, 77, 26, 0.9)", // ✅ Semi-transparent sidebar
          backdropFilter: "blur(8px)",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 2,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Sidebar />
      </Sider>

      {/* ✅ Dynamic marginLeft to adjust content width when sidebar is collapsed */}
      <AntLayout style={{ marginLeft: collapsed ? 80 : 260, transition: "all 0.3s ease-in-out", zIndex: 3 }}>
        <Header
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)", // ✅ Slight transparency
            backdropFilter: "blur(6px)",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#004d1a" }}>Admin Panel</Title>

          <Space size="large">
            {loading ? (
              <Spin size="small" />
            ) : (
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <Space style={{ cursor: "pointer" }}>
                  <UserOutlined style={{ fontSize: "20px" }} />
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>{user?.name}</span>
                </Space>
              </Dropdown>
            )}
          </Space>
        </Header>

        <Content
          style={{
            padding: "24px",
            margin: "24px 16px",
            backgroundColor: "rgba(255, 255, 255, 0.9)", // ✅ Glassmorphism effect
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            transition: "all 0.3s ease-in-out",
            position: "relative",
            zIndex: 3, // ✅ Ensures content is above the background
          }}
        >
          {children}
        </Content>

        {user && <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} user={user} onUpdate={handleProfileUpdate} />}
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
