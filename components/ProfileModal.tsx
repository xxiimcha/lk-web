"use client";

import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
  };
  onUpdate: (updatedUser: { name: string; email: string }) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose, user, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user, form]);

  const handleSave = async (values: { name: string; email: string }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication error. Please log in again.");
        return;
      }

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      onUpdate(updatedUser); // Update the UI
      message.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      message.error("Failed to update profile. Please try again.");
      console.error("Update Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit Profile" open={visible} onCancel={onClose} footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" loading={loading} onClick={() => form.submit()}>Save Changes</Button>
      ]} centered>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter your name!" }]}>
          <Input prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input prefix={<MailOutlined />} disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
