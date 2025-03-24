"use client";

import React, { useState } from "react";
import { Form, Input, Button, Alert, Typography, Card } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";

const { Title, Paragraph } = Typography;

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string }) => {
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
        setError(data.message || "Invalid login credentials");
        setLoading(false);
        return;
      }

      if (data.role !== "admin") {
        setError("Access denied. Admins only.");
        setLoading(false);
        return;
      }

      setToken(data.token);
      setEmail(email);

      // Send OTP to email
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setStep("otp");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), otp: values.otp }),
      });      

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      // OTP verified, proceed to dashboard
      localStorage.setItem("token", token);
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
        backgroundColor: "#f6ffed",
      }}
    >
      <Card style={{ width: 400, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Image
            src="/logo.png"
            alt="Luntiang-Kamay Logo"
            width={80}
            height={80}
            priority
          />
        </div>
        <Title level={3} style={{ textAlign: "center", color: "#52c41a" }}>
          {step === "login"
            ? "Welcome to Luntiang-Kamay"
            : "Enter the OTP sent to your email"}
        </Title>
        <Paragraph style={{ textAlign: "center", color: "#595959" }}>
          {step === "login"
            ? "Please login to access your account."
            : `An OTP was sent to ${email}`}
        </Paragraph>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {step === "login" ? (
          <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
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
        ) : (
          <Form layout="vertical" onFinish={handleVerifyOtp} requiredMark={false}>
            <Form.Item
              label="One-Time Password (OTP)"
              name="otp"
              rules={[{ required: true, message: "Please enter the 6-digit OTP" }]}
              style={{ marginBottom: 24 }}
            >
              <Input
                placeholder="Enter your 6-digit OTP"
                maxLength={6}
                size="large"
                style={{ textAlign: "center", letterSpacing: "4px", fontWeight: 600 }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                width: "100%",
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                fontWeight: "bold",
              }}
            >
              Verify OTP
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Login;
