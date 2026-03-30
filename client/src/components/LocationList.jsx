import React, { useState } from "react";
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
import { useLocation } from "../hooks/useLocation";
import { useTimeZone } from "../hooks/useTimeZone";

const { Title } = Typography;
const { Option } = Select;

const LocationList = () => {
  const {
    locations,
    loading,
    addLocation,
    updateLocation,
    removeLocation,
    refresh,
  } = useLocation();

  const { timeZones, loading: tzLoading } = useTimeZone();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      timeZoneId: record.timeZoneId,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingRecord) {
        await updateLocation(editingRecord._id || editingRecord.id, values);
      } else {
        await addLocation(values);
      }

      if (refresh) await refresh();

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Save Failed:", error);
    }
  };
  const columns = [
    { title: "City", dataIndex: "cityName", key: "cityName" },
    { title: "Country", dataIndex: "countryCode", key: "country" },
    {
      title: "Timezone",
      dataIndex: "timeZoneId",
      key: "timezone",
      render: (tzId) => {
        const match = timeZones.find(
          (tz) => (tz.id || tz._id)?.toString() === tzId?.toString(),
        );
        return match ? `${match.name} (${match.fullName})` : "N/A";
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
            title="Delete this location?"
            onConfirm={() => removeLocation(record._id || record.id)}
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={2}>Location Manager</Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingRecord(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Location
        </Button>
      </div>

      <Table
        rowKey={(record) => record._id || record.id}
        dataSource={locations || []}
        columns={columns}
        loading={loading || tzLoading}
      />

      <Modal
        title={editingRecord ? "Edit Location" : "Add New Location"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="cityName"
            label="City Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Largo" />
          </Form.Item>

          <Form.Item
            name="countryCode"
            label="Country Code"
            rules={[{ required: true }]}
          >
            <Input placeholder="US" />
          </Form.Item>

          <Form.Item
            name="timeZoneId"
            label="Assign Timezone"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select a timezone"
              loading={tzLoading}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {timeZones.map((tz) => (
                <Option key={tz._id || tz.id} value={tz.id || tz._id}>
                  {tz.name} - {tz.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LocationList;
