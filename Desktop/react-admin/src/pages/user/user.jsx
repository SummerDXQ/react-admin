import React,{Component} from "react";
import {Card, Button, Table, Modal, message} from 'antd';
import AddForm from "../category/add-form";
import {formatDate} from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import {PAGE_SIZE} from "../../utils/constants";
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from "../../api";
import UserForm from "./user-form";

export default class User extends Component{
    state = {
        users : [],
        roles:[],
        isShow:false
    }

    initColumns = () => {
        this.columns = [
            {
                title : 'User Name',
                dataIndex : 'username'
            },
            {
                title : 'Email',
                dataIndex : 'email'
            },
            {
                title : 'Phone',
                dataIndex : 'phone'
            },
            {
                title : 'Register Time',
                dataIndex : 'create_time',
                render : formatDate
            },
            {
                title : 'Role',
                dataIndex : 'role_id',
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title : 'Operation',
                render : (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>Edit</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                    </span>
                )
            }
        ]
    }

    // {roleId : roleName}
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((prev,role) => {
            prev[role._id] = role.name;
            return prev;
        },{})
        this.roleNames = roleNames;
    }

    // get user list
    getUsers = async () => {
        const result = await reqUsers();
        if(result.status === 0){
            const {users, roles} = result.data;
            this.initRoleNames(roles);
            this.setState({
                users,
                roles
            })
        }
    }

    // delete user
    deleteUser = (user) => {
        Modal.confirm({
            title : `Do you want to delete ${user.username}?`,
            onOk : async () => {
                const result = await reqDeleteUser(user._id);
                if (result.status === 0){
                    message.success('Successfully delete user!');
                    this.getUsers();
                }
            },
            onCancel(){}
        })
    }

    // add user
    showAdd = () => {
        this.user = null;
        this.setState({isShow: true})
    }
    // edit user
    showUpdate = (user) => {
        this.user = user;
        this.setState({isShow:true})
    }

    componentWillMount() {
        this.initColumns();
    }

    componentDidMount() {
        this.getUsers();
    }

    // add or update user
    addOrUpdateUser = async () => {
        this.setState({isShow : false});
        const user = {
            username : this.username,
            password : this.password,
            phone:this.phone,
            email : this.email,
            role_id : this.role,
        }
        // if it is updating
        if(this.user){
            user._id = this.user._id;
        }
        const result = await reqAddOrUpdateUser(user);
        if (result.status === 0){
            message.success(`Successfully ${this.user ? 'update' : 'add'} user!`);
            this.getUsers();
        }
    }

    handleCancel = () => {
        this.setState({
            isShow : false
        })
    }

    render() {
        const {users, isShow, roles} = this.state;
        const user = this.user || {};
        const title = <Button
                          type='primary'
                          onClick={this.showAdd}
                      >
                            Create User
                      </Button>;
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    // loading={loading}
                    dataSource={users}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize : PAGE_SIZE,
                        showQuickJumper : true
                    }}
                />

                {isShow &&
                <Modal
                    title={ user._id ? "Edit User":"Add User"}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                >
                    <UserForm
                        roles={roles}
                        setUsername = {(username)=>{this.username = username}}
                        setPassword = {(password)=>{this.password = password}}
                        setPhone = {(phone)=>{this.phone = phone}}
                        setEmail = {(email)=>{this.email = email}}
                        setRole = {(role)=>{this.role = role}}
                        user = {user}
                    />
                    {/*<div>Add or Update</div>*/}
                    {/*<AddForm*/}
                    {/*    categories={categories}*/}
                    {/*    parentId={parentId}*/}
                    {/*    setCategoryId = {(categoryId)=>{this.parenId = categoryId}}*/}
                    {/*    CategoryName = {(category)=>{this.category = category}}*/}
                    {/*/>*/}
                </Modal>}
            </Card>
        )
    }
}
