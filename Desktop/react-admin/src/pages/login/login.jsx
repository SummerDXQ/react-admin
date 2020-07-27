import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Form, Input, Button,message} from 'antd'
import './login.less'
import logo from '../../assets/images/logo.png'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin} from '../../api';
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

const Item = Form.Item;

export default class Login extends Component {
    handleSubmit = async (values) => {
        const {username,password} = values;
        const result = await reqLogin(username,password);
        if (result.status === 0){
            message.success('Successfully login!');
            const user = result.data;
            memoryUtils.user = user;
            storageUtils.saveUser(user);
            this.props.history.replace('/');
        }else {
            message.error('Username or password is not correct!');
        }
    }
  render () {
      const user = memoryUtils.user;
      if (user && user._id){
          return <Redirect to='/'/>
      }
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo"/>
          <h1>React Project: Admin Panel</h1>
        </header>
        <section className="login-content">
          <h2>LOGIN</h2>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={(values)=>this.handleSubmit(values)}
            >
                <Item
                    name="username"
                    rules={[
                        { required: true, whitespace:true,message: 'Please input your Username!' },
                        { min: 4, message: 'Username length must greater than 4!' },
                        { max: 12, message: 'Username length must less than 12!' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only include digits,letters and _!' },
                        ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Item>
                <Item
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your Password!' },
                        { min: 4, message: 'Password length must greater than 4!' },
                        { max: 12, message: 'Password length must less than 12!' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Password can only include digits,letters and _!' }
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Item>
            </Form>
        </section>
      </div>
    )
  }
}
