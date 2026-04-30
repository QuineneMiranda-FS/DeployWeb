import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosInstance";

const { Title } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post("/auth/signup", {
        email: values.email,
        password: values.password,
      });

      message.success("Account created! Please login.");
      navigate("/login");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3}>Create Account</Title>
        <Form component="form" layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="email@example.com" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password
              placeholder="Min 6 characters"
              autoComplete="new-password"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign Up
          </Button>
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
