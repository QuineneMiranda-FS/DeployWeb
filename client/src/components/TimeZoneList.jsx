import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Modal,
  Form,
  Input,
  Typography,
  Select,
} from "antd";
import { useTimeZone } from "../hooks/useTimeZone";
import AddTimeZoneForm from "./AddTimeZoneForm";
import "./TimeZoneList.css";

const { Title } = Typography;

const TimeZoneList = () => {
  const {
    timeZones,
    loading,
    removeTimeZone,
    addTimeZone,
    updateTimeZone,
    locations,
  } = useTimeZone();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [form] = Form.useForm();

  const handleEdit = (record) => {
    const initialValues = {
      ...record,
      location: record.location?._id || record.location,
    };
    setEditingRecord(record);
    form.setFieldsValue(initialValues);
    setIsEditModalOpen(true);
  };

  // highlight clears after few seconds
  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const id = editingRecord.id || editingRecord._id;
      await updateTimeZone(id, values);
      setHighlightedId(id);
      setIsEditModalOpen(false);
      setEditingRecord(null);
    } catch (info) {
      console.log("Update Failed:", info);
    }
  };
  const handleAddWrapper = async (values) => {
    const newRecord = await addTimeZone(values);
    if (newRecord?._id || newRecord?.id) {
      setHighlightedId(newRecord._id || newRecord.id);
    }
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      render: (_, record) => (
        <code style={{ fontSize: "12px", color: "#888" }}>
          {record.id || record._id}
        </code>
      ),
    },
    { title: "Abbr", dataIndex: "name", key: "name" },
    { title: "Full Name (IANA)", dataIndex: "fullName", key: "fullName" },
    {
      title: "Location",
      key: "location",
      render: (_, record) => {
        const loc = record.location;
        if (!loc) return "-";
        return typeof loc === "object" ? loc.name || loc.city || loc._id : loc;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this timezone?"
            onConfirm={() => removeTimeZone(record.id || record._id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>
      <Title level={2}>Time Zone Manager</Title>
      <AddTimeZoneForm onAdd={handleAddWrapper} />

      <Table
        rowKey={(record) => record._id || record.id}
        dataSource={timeZones}
        columns={columns}
        loading={loading}
        rowClassName={(record) =>
          record._id === highlightedId || record.id === highlightedId
            ? "highlight-row"
            : ""
        }
      />
      <Modal
        title="Edit Time Zone"
        open={isEditModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalOpen(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Abbreviation (e.g. EST)"
            rules={[{ required: true, min: 3, max: 6 }]}
          >
            <Input placeholder="PST" style={{ textTransform: "uppercase" }} />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Full Name (IANA)"
            rules={[{ required: true, max: 38 }]}
          >
            <Input placeholder="Eastern Standard Time" />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="Location" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimeZoneList;
