import React,{Component} from "react";
import {Form, Input} from 'antd';

const Item = Form.Item;

export default class AddForm extends Component{
    render() {
        const {setRoleName} = this.props;
        return(
            <Form>
                <Item
                    name='roleName'
                    label='Role Name'
                    labelCol={{span:5}}
                    wrapperCol={{span:18}}
                      rules={[
                          {
                              required: true,
                              message: 'Role name is required!',
                          },
                          ({getFieldValue})=>({
                              validator(rule,value){
                                  return Promise.resolve(setRoleName(getFieldValue('roleName')));
                              }
                          })
                      ]}
                >
                    <Input placeholder='role name'/>
                </Item>
            </Form>
        )
    }
}