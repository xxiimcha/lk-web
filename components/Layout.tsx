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

  // ✅ Corrected Dropdown Menu Items for Ant Design v5
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
    <AntLayout style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={250} style={{ height: "100vh", background: "#004d1a", position: "fixed", left: 0, top: 0, bottom: 0 }}>
        <Sidebar />
      </Sider>

      <AntLayout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Header style={{ backgroundColor: "#ffffff", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd" }}>
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

        <Content style={{ padding: "24px", margin: "24px 16px", backgroundColor: "#fff" }}>
          {children}
        </Content>

        {user && (
          <ProfileModal 
            visible={profileModalVisible} 
            onClose={() => setProfileModalVisible(false)} 
            user={user} 
            onUpdate={handleProfileUpdate} 
          />
        )}
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
