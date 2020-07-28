import React,{Component} from "react";
import {Form, Input, Select} from 'antd';

const Item = Form.Item;
const Option = Select.Option;

export default class AddForm extends Component{
    render() {
        const {categories,parentId,setCategoryId,CategoryName} = this.props;
        return(
            <Form>
                <Item
                    name='parentId'
                    initialValue={parentId}
                >
                    <Select
                        name='category'
                        onChange={(value)=>setCategoryId(value)}
                    >
                        <Option value='0'>First classification</Option>
                        {
                            categories.map(item =>  <Option key={item._id} value={item._id}>{item.name}</Option>)
                        }
                    </Select>
                </Item>
                <Item name='categoryName'
                      rules={[
                          {
                              required: true,
                              message: 'Category name is required!',
                          },
                          ({getFieldValue})=>({
                              validator(rule,value){
                                  return Promise.resolve(CategoryName(getFieldValue('categoryName')));
                              }
                          })
                      ]}
                >
                    <Input placeholder='category name'/>
                </Item>
            </Form>
        )
    }
}