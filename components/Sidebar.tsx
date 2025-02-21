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
        background: "rgba(0, 77, 26, 0.85)", // Glassmorphism effect
        backdropFilter: "blur(10px)", // Smooth blur
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.2)",
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
            <Image
              src="/logo.png"
              alt="Luntiang Kamay Logo"
              width={60}
              height={60}
              className="animate-fade-in"
            />
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
        className="custom-menu"
      />

      {/* Sidebar Footer */}
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
          opacity: collapsed ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <span className="animate-fade-in">© 2024 Luntiang Kamay</span>
      </div>
    </Sider>
  );
};

export default Sidebar;
