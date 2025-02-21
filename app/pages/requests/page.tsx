"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Table, Button, Tag, Modal, Input, Spin, message, Descriptions, Image } from "antd";
import { FiUser, FiFileText, FiClock, FiTag, FiImage } from "react-icons/fi";
import type { ColumnsType } from "antd/es/table";

interface SeedRequest {
  _id: string;
  user?: {
    username: string;
    email: string;
    role: string;
  };
  seedType: string;
  description: string;
  imagePath: string | null;
  status: string;
  createdAt: string;
}

const Requests = () => {
  const [requests, setRequests] = useState<SeedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<SeedRequest | null>(null);
  const [modalType, setModalType] = useState<"view" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/seedrequests");
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching seed requests:", error);
        message.error("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const updateRequestStatus = async (id: string, status: string, reason?: string) => {
    try {
      const response = await fetch(`/api/seedrequests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reason ? { status, reason } : { status }),
      });
      if (!response.ok) throw new Error("Failed to update request status");

      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );

      message.success(`Request marked as ${status}`);
      closeModal();
    } catch (error) {
      console.error(`Error updating request (${status}):`, error);
      message.error("Failed to update request.");
    }
  };

  const handleView = (request: SeedRequest) => {
    setSelectedRequest(request);
    setModalType("view");
  };

  const handleReject = (request: SeedRequest) => {
    setSelectedRequest(request);
    setModalType("reject");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRequest(null);
    setRejectReason("");
  };

  const columns: ColumnsType<SeedRequest> = [
    {
      title: "Seed Type",
      dataIndex: "seedType",
      key: "seedType",
      sorter: (a, b) => a.seedType.localeCompare(b.seedType),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "approved" ? "green" : status === "rejected" ? "red" : status === "released" ? "blue" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <Button onClick={() => handleView(record)}>View</Button>
          {record.status === "approved" ? (
            <Button type="primary" onClick={() => updateRequestStatus(record._id, "released")}>
              Release
            </Button>
          ) : record.status === "rejected" ? (
            <Button disabled>Rejected</Button>
          ) : record.status !== "released" ? (
            <>
              <Button type="primary" onClick={() => updateRequestStatus(record._id, "approved")}>
                Approve
              </Button>
              <Button danger onClick={() => handleReject(record)}>
                Reject
              </Button>
            </>
          ) : (
            <Button disabled>Released</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div
        style={{
          minHeight: "100vh",
          padding: "20px",
          backgroundImage: "url('/background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {/* ✅ Darker overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)", // ✅ Darker to contrast text
            backdropFilter: "blur(6px)", // ✅ Adds soft blur effect
            zIndex: 1,
          }}
        ></div>

        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)", // ✅ More opacity for content readability
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            padding: "20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Requests</h1>
          <p className="text-gray-600 mb-6">Manage all seed requests submitted by users.</p>

          {loading ? (
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <Table columns={columns} dataSource={requests} rowKey="_id" pagination={{ pageSize: 10 }} />
          )}
        </div>
      </div>

      {/* View Modal */}
      <Modal title="Request Details" open={modalType === "view"} onCancel={closeModal} footer={null} centered>
        {selectedRequest && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label={<><FiFileText /> Seed Type</>}>
              {selectedRequest.seedType}
            </Descriptions.Item>
            <Descriptions.Item label={<><FiTag /> Status</>}>
              <Tag color="blue">{selectedRequest.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={<><FiClock /> Created At</>}>
              {new Date(selectedRequest.createdAt).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label={<><FiUser /> Requested By</>}>
              {selectedRequest.user?.username || "Unknown"}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedRequest.description}
            </Descriptions.Item>
            {selectedRequest.imagePath && (
              <Descriptions.Item label={<><FiImage /> Image</>}>
                <Image width={200} src={selectedRequest.imagePath} alt="Seed Request" />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </Layout>
  );
};

export default Requests;
