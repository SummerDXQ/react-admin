import React,{Component} from "react";
import {Card, Table, Button, message, Modal} from "antd";
import {PlusOutlined, ArrowRightOutlined} from '@ant-design/icons';
import LinkButton from "../../components/link-button";
import {reqCategory, reqUpdateCategory,reqAddCategory} from "../../api";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

export default class Category extends Component{
    state = {
        categories:[],
        subCategories:[],
        loading:false,
        parentId:'0',
        parentName:'',
        showStatus:0   // 0:hidden, 1:add, 2:update
    }

    // table column
    initColumns = () => {
        this.columns = [
            {
                title: 'Category Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Operation',
                width:300,
                render : (category) => {
                    return (
                        <span>
                            <LinkButton onClick={()=>this.showUpdate(category)}>Edit</LinkButton>
                            {
                                this.state.parentId === '0'
                                    ? <LinkButton onClick={()=>this.showSubCategories(category)}>SubCategory</LinkButton>
                                    : null
                            }
                        </span>
                    )
                }}
        ];
    }

    showSubCategories = (category) => {
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            // get subCategories
            this.getCategories();
        })
    }

    // show first category
    showCategories = () => {
        this.setState({
            parentId : '0',
            parentName : '',
            subCategories : []
        })
    }

    // get first category
    getCategories = async (parentId) => {
        this.setState({
            loading:true
        })
        parentId = parentId || this.state.parentId;
        const result = await reqCategory(parentId);
        this.setState({
            loading:false
        })
        if(result.status === 0){
            const categories = result.data;
            if (parentId === '0'){
                this.setState({categories})
            }else {
                this.setState({
                    subCategories : categories
                })
            }
        }else {
            message.error('Fail to load product category!')
        }
    }

    // hide modal
    handleCancel = () => {
        this.setState({
            showStatus : 0
        })
    }

    // show add modal
    showAdd = () => {
        this.setState({
            showStatus : 1
        })
    }

    // show update modal
    showUpdate = (category) => {
        console.log(category.name);
        // save category info
        this.category = category;
        this.setState({
            showStatus : 2
        })
    }

    // add category
    addCategory = async () => {
        if(this.category){
            // hide modal
            this.setState({
                showStatus : 0
            })
            const parentId = this.parenId || this.state.parentId;
            const result = await reqAddCategory(this.category,parentId);
            if(result.status === 0){
                // avoid unnecessary rerender
                if(parentId === this.state.parentId){
                    this.getCategories();
                }else if(parentId === '0'){
                    // add first classification at second classification
                    this.getCategories('0');
                }
            }
        }
    }

    // update category
    updateCategory = async () => {
        if(this.categoryName){
            // hide modal
            this.setState({
                showStatus : 0
            })
            const categoryId = this.category._id;
            const categoryName = this.categoryName;
            // update category
            const result = await reqUpdateCategory(categoryId,categoryName);
            if (result.status === 0){
                // reload category
                this.getCategories();
            }
        }
    }

    componentWillMount() {
        this.initColumns();
    }

    componentDidMount() {
        this.getCategories();
    }

    render() {
        const {categories, loading, parentId, parentName, subCategories, showStatus} = this.state;
        const category = this.category || {};
        const title = parentId === '0' ? 'First Category' : (
            <span>
                <LinkButton onClick={()=>this.showCategories()}>
                    First Category
                </LinkButton>
                <ArrowRightOutlined />&nbsp;
                <span>{parentName}</span>
            </span>
        );
        const extra = (
            <Button type='primary' onClick={()=>this.showAdd()}>
                <PlusOutlined />
                Add
            </Button>
        );

        return (
            <Card title={title} extra={extra} style={{ width: '100%' }}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={parentId === '0' ? categories : subCategories}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize : 5,
                        showQuickJumper : true
                    }}
                />
                {showStatus === 1 && <Modal
                    title="Add Category"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categories={categories}
                        parentId={parentId}
                        setCategoryId = {(categoryId)=>{this.parenId = categoryId}}
                        CategoryName = {(category)=>{this.category = category}}
                    />
                </Modal>
                }

                {/*showStatus === 2 for updating initial value*/}
                { showStatus === 2 && <Modal
                    title="Update Category"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setCategoryName = {(categoryName)=>{this.categoryName = categoryName}}
                    />
                </Modal>}
            </Card>
        )
    }
}


