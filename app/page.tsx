"use client";

import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography, Card } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Title, Paragraph } = Typography;

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      // Check if the role is admin
      if (data.role !== "admin") {
        setError("Access denied. Admins only.");
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push("/pages/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f6ffed", // Light green background
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Image
            src="/logo.png" // Update this with the path to your logo
            alt="Luntiang-Kamay Logo"
            width={80}
            height={80}
            priority
          />
        </div>
        <Title level={3} style={{ textAlign: "center", color: "#52c41a" }}>
          Welcome to Luntiang-Kamay
        </Title>
        <Paragraph style={{ textAlign: "center", color: "#595959" }}>
          Please login to access your account.
        </Paragraph>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: "100%",
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
            }}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
