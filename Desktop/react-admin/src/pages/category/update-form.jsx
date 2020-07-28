import React from "react";
import {Form, Input} from 'antd';

const Item = Form.Item;

const UpdateForm = (props) => {
    const [form] = Form.useForm();
    const {categoryName} = props;
    return(
        <Form
            initialValues={{categoryName:categoryName}}
            form={form}
        >
            <Item
                name='categoryName'
                rules={[
                    {
                        required: true,
                        message: 'Category name is required!',
                    },
                    ({getFieldValue})=>({
                        validator(rule,value){
                            return Promise.resolve(props.setCategoryName(getFieldValue('categoryName')));
                        }
                    })
                ]}
            >
                <Input placeholder='category name'/>
            </Item>
        </Form>
        )
}

export default UpdateForm;