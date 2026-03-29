import React from "react";
import { Form, Input, Button, Select } from "antd";

const AddTimeZoneForm = ({ onAdd, locations }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const locationId = Array.isArray(values.location)
      ? values.location[0]
      : values.location;

    const selectedLocation = locations.find((loc) => loc._id === locationId);

    const submissionValues = {
      name: values.name,
      fullName: values.fullName,
      cityName: selectedLocation ? selectedLocation.cityName : locationId,
      countryCode: "US",
    };

    await onAdd(submissionValues);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="inline"
      style={{ marginBottom: 20 }}
    >
      <Form.Item name="name" rules={[{ required: true, message: "Required" }]}>
        <Input placeholder="Abbr (e.g. EST)" style={{ width: 120 }} />
      </Form.Item>

      <Form.Item
        name="fullName"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input placeholder="Full Name (IANA)" style={{ width: 200 }} />
      </Form.Item>

      <Form.Item name="location" style={{ width: 200 }}>
        <Select
          mode="tags"
          maxCount={1}
          placeholder="Select or type city"
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {locations.map((loc) => (
            <Select.Option key={loc._id} value={loc._id}>
              {loc.cityName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Add
      </Button>
    </Form>
  );
};

export default AddTimeZoneForm;
