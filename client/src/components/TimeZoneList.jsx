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
      location: record.locationData?._id || record.location,
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
    const id = editingRecord?._id || editingRecord?.id;
    console.log("Updating ID:", id); // testing
    if (!id) return console.error("No ID found for update");
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

    if (newRecord?._id) {
      setHighlightedId(newRecord._id);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <code style={{ color: "#888" }}>{text}</code>,
    },
    { title: "Abbr", dataIndex: "name", key: "name" },
    { title: "Full Name (IANA)", dataIndex: "fullName", key: "fullName" },
    {
      title: "Location",
      dataIndex: "cityName",
      key: "cityName",
      render: (text) => text || "Unknown City",
    },
    //testing
    {
      title: "Debug ID",
      render: (_, record) => <span>Match ID: {record.id}</span>,
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
      <AddTimeZoneForm onAdd={handleAddWrapper} locations={locations} />

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

          <Form.Item name="location" style={{ width: 200 }}>
            <Select
              mode="tags"
              maxCount={1}
              placeholder="Select or type city"
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {locations.map((loc) => (
                <Select.Option key={loc._id} value={loc._id}>
                  {loc.cityName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimeZoneList;
