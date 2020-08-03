import React,{Component} from "react";
import {Card, Form, Input, Cascader, Upload, Button, message} from 'antd';
import LinkButton from "../../components/link-button";
import {ArrowLeftOutlined } from '@ant-design/icons';
import {reqCategory, reqAddOrUpdateProduct} from "../../api";
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
// import detail from "./detail";

const Item = Form.Item;
const {TextArea} = Input;

export default class ProductAddUpdate extends Component{
    state = {
        options : [],
    };

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.editor = React.createRef();
    }

    // get category list
    getCategories = async (parentId) => {
        const result = await reqCategory(parentId);
        if (result.status === 0){
            const categories = result.data;
            if (parentId === '0'){
                // get first classification category
                this.initOptions(categories);
            }else {
                return categories;   // async function returns promise
            }
        }
    }

    // initial options
    initOptions = async (categories) => {
        const options = categories.map(item => {
            return {
                value : item._id,
                label: item.name,
                isLeaf:false
            }
        })
        const {isUpdate, product} = this;
        const {pCategoryId} = product;
        if (isUpdate && pCategoryId !== '0'){
            // get secondary classification list
            const subCategories = await this.getCategories(pCategoryId);
            const childOptions = subCategories.map(item=>{
                return {
                    value : item._id,
                    label : item.name,
                    isLeaf: true
                }
            })
            // first classification category
            const targetOption = options.find(item => item.value === pCategoryId);
            // relate to first classification category
            targetOption.children = childOptions;
        }
        this.setState({options});
    }

    componentWillMount() {
        const product = this.props.location.state;
        // convert to boolean
        this.isUpdate = !!product;
        // save product info
        this.product = product || {};
    }

    componentDidMount() {
        this.getCategories('0');
    }

    // submit form data
    submit = async (values) => {
        const {name, desc, price,category} = values;
        let pCategoryId,categoryId;
        if(category.length === 1){
            pCategoryId = '0';
            categoryId = category[0];
        }else {
            pCategoryId = category[0];
            categoryId = category[1];
        }
        const imgs = this.myRef.current.getImgs();
        const detail = this.editor.current.getDetail();
        const product = {name, desc, price,imgs,detail,pCategoryId,categoryId};
        if (this.isUpdate){
            product._id = this.product._id;
        }
        const result = await reqAddOrUpdateProduct(product);
        if (result.status === 0){
            message.success(`${this.isUpdate ? 'Successfully update product!' : 'Successfully add product!'}`);
            this.props.history.goBack();
        }else {
            message.error(`${this.isUpdate ? 'Update product failed!' : 'Add product failed!'}`);
        }
    }

    // validate price
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0){
            callback();
        }else {
            callback('Price must greater than 0!');
        }
    }

    loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[0];
        // show loading
        targetOption.loading = true;
        // load options lazily
        const subCategories = await this.getCategories(targetOption.value);
        // hide loading
        targetOption.loading = false;
        if (subCategories && subCategories.length > 0){
            // secondary classification category
            const childOptions = subCategories.map(item => {
                return {
                    value : item._id,
                    label : item.name,
                    isLeaf: true
                }
            })
            targetOption.children = childOptions;
        }else {
            targetOption.isLeaf = true;
        }

        // update options
        this.setState({
            options: [...this.state.options],
        });
    };

    render() {
        const {isUpdate, product} = this;
        const {pCategoryId, categoryId, imgs, detail, desc} = product;
        // for cascader
        const categoryIds = [];
        if (isUpdate){
            if (pCategoryId === '0'){
                categoryIds.push(categoryId);
            }else {
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
        }
        const title = (
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{fontSize:15}}/>
                    <span>{isUpdate ? 'Edit Product' : 'Add Product'}</span>
                </LinkButton>
            </span>
        );
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 8},
        };
        return(
            <Card title={title}>
                <Form
                    {...formItemLayout}
                    onFinish={(values)=>this.submit(values)}
                    name="add"
                >
                    <Item
                        label='Product Name'
                        name='name'
                        rules={[{ required: true, message: 'product name is required!' }]}
                        initialValue={product.name}
                    >
                        <Input placeholder='product name'/>
                    </Item>
                    <Item
                        label='Product Description'
                        name='desc'
                        rules={[{ required: true, message: 'product description is required!' }]}
                        initialValue={desc}
                    >
                        <TextArea placeholder='product description' autoSize={{ minRows: 2, maxRows: 6 }}/>
                    </Item>
                    <Item
                        label='Product Price'
                        name='price'
                        rules={[
                                { required: true, message: 'product price is required!' },
                                { validator: this.validatePrice },
                            ]}
                        initialValue={product.price}
                    >
                        <Input
                            type='number'
                            placeholder='product price'
                            addonBefore={'$'}
                        />
                    </Item>
                    <Item
                        label='Product Category'
                        name='category'
                        rules={[{ required: true, message: 'product category is required!' }]}
                        initialValue={categoryIds}
                    >
                        <Cascader
                            placeholder='please select product category'
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item
                        label='Product Image'
                        name='image'
                        initialValue={imgs}
                        // rules={[{ required: true, message: 'product image is required!' }]}
                    >
                        <PicturesWall ref={this.myRef} imgs={imgs}/>
                    </Item>
                    <Item
                        label='Product Detail'
                        name='detail'
                        // rules={[{ required: true, message: 'product name is required!' }]}
                        labelCol={{span:2}}
                        wrapperCol={{span:20}}
                        // initialValue={detail}
                    >
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                    >Submit</Button>
                </Form>
            </Card>
        )
    }
}
