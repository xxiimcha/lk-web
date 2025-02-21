"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Menu, Button, Tooltip } from "antd";
import { FiHome, FiFileText, FiUsers, FiMenu } from "react-icons/fi";
import Image from "next/image";

const { Sider } = Layout;

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarMenuItems = [
    {
      key: "/pages/dashboard",
      icon: <FiHome size={22} />,
      label: <Link href="/pages/dashboard">Dashboard</Link>,
    },
    {
      key: "/pages/requests",
      icon: <FiFileText size={22} />,
      label: <Link href="/pages/requests">Requests</Link>,
    },
    {
      key: "/pages/users",
      icon: <FiUsers size={22} />,
      label: <Link href="/pages/users">Users</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={260}
      style={{
        height: "100vh",
        background: "rgba(0, 77, 26, 0.9)", // Stronger contrast for sidebar
        backdropFilter: "blur(12px)", // Better blur effect
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.3)",
        overflowY: "auto",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Sidebar Header with Logo & Toggle Button */}
      <div
        style={{
          textAlign: "center",
          padding: "16px",
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          transition: "all 0.3s ease-in-out",
        }}
      >
        {!collapsed && (
          <>
            <Image src="/logo.png" alt="Luntiang Kamay Logo" width={50} height={50} />
            <h2 style={{ margin: "10px 0 0 0", fontSize: "16px", fontWeight: "600" }}>
              Luntiang Kamay
            </h2>
          </>
        )}

        {/* Collapse Button */}
        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={<FiMenu size={20} color="white" />}
            style={{
              position: "absolute",
              top: 18,
              right: collapsed ? "10px" : "15px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              padding: "5px",
              transition: "background 0.3s ease-in-out",
            }}
          />
        </Tooltip>
      </div>

      {/* Sidebar Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={sidebarMenuItems}
        style={{
          backgroundColor: "transparent",
          fontSize: "16px",
          fontWeight: "500",
          paddingTop: "10px",
        }}
      />

      {/* Sidebar Footer */}
      {!collapsed && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
            borderTop: "1px solid rgba(255, 255, 255, 0.3)",
            paddingTop: "10px",
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          © 2024 Luntiang Kamay
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;
