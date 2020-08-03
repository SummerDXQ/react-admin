import React,{PureComponent} from "react";
import {Form, Input, Tree} from 'antd';
import menuList from "../../config/menuConfig";

const Item = Form.Item;

export default class AuthForm extends PureComponent{
    // state = {
    //     checkedKeys : []
    // }

    constructor(props) {
        super(props);
        const {menus} = this.props.role;
        this.state={
            checkedKeys : menus
        }
    }


    // create tree nodes
    getTreeNodes = (menuList) => {
        return menuList.reduce((prev,item) => {
            prev[0].children.push({
                title: item.title,
                key: item.key,
                children:item.children || []
            })
            return prev
        },[
            {title: 'Authority',
            key: '/',
            children: []
            }
            ])
    }

    onCheck = (checkedKeys) => {
        this.setState({checkedKeys})
    }

    // for parent/role component
    getMenus = () => this.state.checkedKeys;

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList);
    }

    render() {
        const {role} = this.props;
        const {checkedKeys} = this.state;
        return(
            <Form
                initialValues={{
                    ['roleName']:role.name
                }}
            >
                <Item
                    name='roleName'
                    label='Role Name'
                    labelCol={{span:5}}
                    wrapperCol={{span:18}}
                    rules={[
                        {
                            required: true,
                            message: 'Role name is required!',
                        }
                    ]}
                >
                    <Input disabled/>
                </Item>
                <Tree
                    checkable
                    treeData={this.treeNodes}
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                />
            </Form>
        )
    }
}