import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Login successful!");
      navigate("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
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
        <Title level={3}>Login</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input a valid email!",
              },
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>

          <div style={{ marginTop: "15px", textAlign: "center" }}>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
