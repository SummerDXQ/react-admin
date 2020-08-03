import React,{Component} from "react";
import {Form, Input, Select} from 'antd';

const Item = Form.Item;
const Option = Select.Option;

export default class UserForm extends Component{
    render() {
        const {roles, setUsername,setPassword,setEmail,setRole,setPhone, user} = this.props;
        console.log(user);
        return(
            <Form
                labelCol={{span:5}}
                wrapperCol={{span:18}}
                initialValues={{
                    username:user.username,
                    phone:user.phone,
                    email:user.email,
                    role_id:user.role_id,
                }}
            >
                <Item
                    name='username'
                    label='User Name'
                    rules={[
                        {
                            required: true,
                            message: 'User name is required!',
                        },
                            ({getFieldValue})=>({
                                validator(rule,value){
                                return Promise.resolve(setUsername(getFieldValue('username')));
                            }
                        })
                    ]}
                >
                    <Input placeholder='user name'/>
                </Item>
                {user._id ? null :
                    <Item
                        name='password'
                        label='Password'
                        rules={[
                            {
                                required: true,
                                message: 'Password is required!',
                            },
                            ({getFieldValue})=>({
                                validator(rule,value){
                                    return Promise.resolve(setPassword(getFieldValue('password')));
                                }
                            })
                        ]}
                    >
                        <Input placeholder='Password' type="password"/>
                    </Item>
                }
                <Item
                    name='phone'
                    label='Phone'
                    rules={[
                        {
                            required: true,
                            message: 'Phone is required!',
                        },
                        ({getFieldValue})=>({
                            validator(rule,value){
                                return Promise.resolve(setPhone(getFieldValue('phone')));
                            }
                        })
                    ]}
                >
                    <Input placeholder='phone'/>
                </Item>
                <Item
                    name='email'
                    label='Email'
                    rules={[
                        {
                            required: true,
                            message: 'Email is required!',
                        },
                        ({getFieldValue})=>({
                            validator(rule,value){
                                return Promise.resolve(setEmail(getFieldValue('email')));
                            }
                        })
                    ]}
                >
                    <Input placeholder='email'/>
                </Item>
                <Item
                    name='role_id'
                    label='Role'
                    rules={[
                        {
                            required: true,
                            message: 'ROle is required!',
                        },
                        ({getFieldValue})=>({
                            validator(rule,value){
                                return Promise.resolve(setRole(getFieldValue('role_id')));
                            }
                        })
                    ]}
                >
                    <Select
                        // value={searchType}
                        // style={{width:150}}
                        // onChange={value => this.setState({
                        //     searchType:value
                        // })}
                    >
                        {roles.map((item)=><Option key={item._id} value={item._id}>{item.name}</Option>)}
                    </Select>
                </Item>
            </Form>
        )
    }
}