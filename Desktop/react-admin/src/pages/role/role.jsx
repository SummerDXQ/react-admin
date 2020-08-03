import React,{Component} from "react";
import {Card, Table, Button, Modal, message} from "antd";
import {PAGE_SIZE} from "../../utils/constants";
import {reqRole, reqAddRole,reqUpdateRole} from "../../api";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import memoryUtils from "../../utils/memoryUtils";
import {formatDate} from "../../utils/dateUtils";

export default class Role extends Component{
    state = {
        roles:[],
        role:{},          // selected row
        isShowAdd:false,
        isShowAuth:false
    }

    constructor(props) {
        super(props);
        this.auth = React.createRef();
    }

    initColumn = () => {
        this.columns = [
            {
                title:"Role Name",
                dataIndex:"name"
            },
            {
                title:"Create Time",
                dataIndex:"create_time",
                render:(create_time) => formatDate(create_time)
            },
            {
                title:"Authorization time",
                dataIndex:"auth_time",
                render:formatDate
            },
            {
                title:"Authorizer",
                dataIndex:"auth_name"
            }
        ]
    };

    // click row
    onRow = (role) => {
        return {
            onClick : (event) => {
                this.setState({
                    role
                })
            }
        }
    }

    // get role list
    getRoles = async () => {
        const result = await reqRole();
        if(result.status === 0){
            const roles = result.data;
            this.setState({
                roles
            })
        }
    }

    // Add role
    addRole = async () => {
        const result = await reqAddRole(this.roleName);
        if (result.status === 0){
            this.setState({isShowAdd : false})
            message.success('Successfully add role!')
            const role = result.data;
            // change state base on existing state
            this.setState(state => ({
                roles : [...state.roles, role]
            }))
        }else {
            message.error('Failed to add role!');
        }
    }

    updateRole = async () => {
        // debugger;
        this.setState({isShowAuth:false});
        const role = this.state.role;
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        // params
        role.auth_time = Date.now();
        role.auth_name = memoryUtils.user.username;
        // update role
        const result = await reqUpdateRole(role);
        if (result.status === 0){
            message.success('Successfully update role!')
            this.getRoles();
        }else {
            message.error('Failed to update role!')
        }
    }

    componentWillMount() {
        this.initColumn();
    }

    componentDidMount() {
        this.getRoles()
    }


    render() {
        const {roles, role,isShowAdd, isShowAuth} = this.state;
        const title = (
            <span>
                <Button type='primary' onClick={()=>this.setState({isShowAdd: true})}>Create Role</Button> &nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth: true})}>Set Authority</Button>
            </span>
        );
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize : PAGE_SIZE}}
                    rowSelection={{type:'radio',selectedRowKeys : [role._id]}}
                    onRow={this.onRow}
                />

                {isShowAdd && <Modal
                    title="Set Role"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>this.setState({isShowAdd: false})}
                >
                    <AddForm
                        // categories={categories}
                        // parentId={parentId}
                        setRoleName = {(roleName)=>{this.roleName = roleName}}
                        // CategoryName = {(category)=>{this.category = category}}
                    />
                </Modal>
                }

                {isShowAuth && <Modal
                    title="Set Authority"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>this.setState({isShowAuth: false})}
                >
                    <AuthForm
                        role={role}
                        // roles={roles}
                        ref={this.auth}
                        // categories={categories}
                        // parentId={parentId}
                        // setRoleName = {(roleName)=>{this.roleName = roleName}}
                        // CategoryName = {(category)=>{this.category = category}}
                    />
                </Modal>
                }
            </Card>
        )
    }
}
