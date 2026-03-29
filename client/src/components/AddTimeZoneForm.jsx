import React from "react";
import { Form, Input, Button, Card } from "antd";

const AddTimeZoneForm = ({ onAdd }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    await onAdd(values);
    form.resetFields(); // Clear
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <Form form={form} layout="inline" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input a name!" }]}
        >
          <Input placeholder="EST" />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Full Name (IANA)"
          rules={[{ required: true, max: 38 }]}
        >
          <Input placeholder="Eastern Standard Time" />
        </Form.Item>

        <Form.Item name="location" label="Location">
          <Input placeholder="City" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Timezone
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddTimeZoneForm;
