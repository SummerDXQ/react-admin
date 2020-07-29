import React,{Component} from "react";
import {Card, Select, Input, Button, Table, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import LinkButton from "../../components/link-button";
import {reqProducts, reqSearchProducts, reqUpdateStatus} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";

const Option = Select.Option;

export default class ProductHome extends Component{
    state = {
        products : [],
        total:0,
        loading:false,
        searchName:'',
        searchType:'productName'
    }

    initColumns = () =>  {
        this.columns = [
            {
                title: 'Product Name',
                dataIndex: 'name',
            },
            {
                title: 'Description',
                dataIndex: 'desc',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (price) => '$' + price
            },
            {
                title: 'Status',
                // dataIndex: 'status',
                width:100,
                render: (product) => {
                    const {status, _id} = product;
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={()=>this.updateStatus(_id, status === 1 ? 2 : 1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: 'Operation',
                width:100,
                render: (product) => {
                    return (
                        <span>
                            <LinkButton
                                onClick={()=>this.props.history.push('/product/detail',{product})}
                            >
                                Detail
                            </LinkButton>
                            <LinkButton
                                onClick={()=>this.props.history.push('/product/detail',product)}
                            >
                                Edit
                            </LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    // update product status
    updateStatus = async (productId,status) => {
        const result = await reqUpdateStatus(productId,status);
        if (result.status === 0){
            message.success('Successfully update product status!');
            this.getProducts(this.pageNum);
        }
    }

    // get products
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;
        this.setState({
            loading : true
        })
        const {searchName, searchType} = this.state;
        let result;
        if (searchName){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName});
        }else {
            result = await reqProducts(pageNum,PAGE_SIZE);
        }
        this.setState({loading : false})
        if (result.status === 0){
            const {total, list} = result.data;
            this.setState({
                total,
                products : list
            })
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1);
    }

    render() {
        const {products, total, loading, searchName, searchType} = this.state;
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{width:150}}
                    onChange={value => this.setState({
                        searchType:value
                    })}
                >
                    <Option value='productName'>search by name</Option>
                    <Option value='productDesc'>search by description</Option>
                </Select>
                <Input
                    placeholder='keyword'
                    style={{width:150,margin:'0 15px'}}
                    value={searchName}
                    onChange={e => this.setState({
                        searchName:e.target.value
                    })}
                />
                <Button
                    type='primary'
                    onClick={()=>this.getProducts(1)}
                >search</Button>
            </span>
        );
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
                <PlusOutlined />
                Add Product
            </Button>
        );
        return(
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    bordered
                    pagination={{
                        defaultPageSize : PAGE_SIZE,
                        showQuickJumper:true,
                        total,
                        onChange : (pageNum)=>{
                            this.getProducts(pageNum)
                        }
                    }}
                />
            </Card>
        )
    }
}
