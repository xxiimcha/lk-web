"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, Row, Col, Statistic, Spin } from "antd";
import { motion } from "framer-motion";
import { FiUsers, FiFileText, FiCheckCircle, FiClock, FiTag } from "react-icons/fi";

const Dashboard = () => {
  const [data, setData] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    releasedRequests: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  interface RequestData {
    status: string;
  }

  interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, usersRes] = await Promise.all([
          fetch("/api/seedrequests"),
          fetch("/api/users"),
        ]);

        const requestsData: RequestData[] = await requestsRes.json();
        const usersData: UserData[] = await usersRes.json();

        const totalRequests = requestsData.length;
        const pendingRequests = requestsData.filter((r) => r.status === "pending").length;
        const approvedRequests = requestsData.filter((r) => r.status === "approved").length;
        const releasedRequests = requestsData.filter((r) => r.status === "released").length;
        const totalUsers = usersData.length;

        setData({
          totalRequests,
          pendingRequests,
          approvedRequests,
          releasedRequests,
          totalUsers,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardsData = [
    {
      title: "Total Requests",
      value: data.totalRequests,
      icon: <FiFileText size={40} />,
      bg: "rgba(24, 144, 255, 0.8)",
      glow: "rgba(24, 144, 255, 0.4)",
    },
    {
      title: "Pending Requests",
      value: data.pendingRequests,
      icon: <FiClock size={40} />,
      bg: "rgba(250, 173, 20, 0.8)",
      glow: "rgba(250, 173, 20, 0.4)",
    },
    {
      title: "Approved Requests",
      value: data.approvedRequests,
      icon: <FiCheckCircle size={40} />,
      bg: "rgba(82, 196, 26, 0.8)",
      glow: "rgba(82, 196, 26, 0.4)",
    },
    {
      title: "Released Requests",
      value: data.releasedRequests,
      icon: <FiTag size={40} />,
      bg: "rgba(114, 46, 209, 0.8)", 
      glow: "rgba(114, 46, 209, 0.4)",
    },
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: <FiUsers size={40} />,
      bg: "rgba(250, 84, 28, 0.8)",
      glow: "rgba(250, 84, 28, 0.4)",
    },
  ];

  return (
    <Layout>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundImage: "url('/background.jpg')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {/* */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.6)", 
            backdropFilter: "blur(8px)",
            zIndex: 1,
          }}
        ></div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "20px", position: "relative", zIndex: 2 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: "20px", padding: "20px", position: "relative", zIndex: 2 }}>
            {cardsData.map((card, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    borderRadius: "15px",
                    boxShadow: `0px 0px 15px ${card.glow}`,
                    overflow: "hidden",
                    textAlign: "center",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "15px",
                  }}
                >
                  <Card
                    bordered={false}
                    style={{
                      background: card.bg,
                      borderRadius: "12px",
                      color: "#fff",
                      padding: "20px",
                      textAlign: "center",
                      fontWeight: "bold",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {card.icon}
                      <Statistic
                        title={
                          <span
                            style={{
                              color: "rgba(255, 255, 255, 0.85)",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {card.title}
                          </span>
                        }
                        value={card.value}
                        valueStyle={{
                          color: "#fff",
                          fontSize: "28px",
                          fontWeight: "bold",
                        }}
                      />
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
