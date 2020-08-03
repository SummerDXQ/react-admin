import React,{Component} from "react";
import {Card, List } from "antd";
import {ArrowLeftOutlined} from '@ant-design/icons';
import LinkButton from "../../components/link-button";
import {BASE_IMG_URL} from "../../utils/constants";
import {reqCategoryInfo} from "../../api";

const Item = List.Item;

export default class ProductDetail extends Component{
    state = {
        cName1:'',
        cName2:''
    }

    async componentDidMount() {
        const {pCategoryId, categoryId} = this.props.location.state.product;
        if(pCategoryId === '0'){
            const result = await reqCategoryInfo(categoryId);
            const cName1 = result.data.name;
            this.setState({
                cName1
            })
        }else {
            // const result1 = await reqCategoryInfo(pCategoryId);
            // const result2 = await reqCategoryInfo(categoryId);
            // const cName1 = result1.data.name;
            // const cName2 = result2.data.name;
            const results = await Promise.all([reqCategoryInfo(pCategoryId),reqCategoryInfo(categoryId)]);
            const cName1 = results[0].data.name;
            const cName2 = results[1].data.name;
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {
        const {name,desc,price,detail,imgs} = this.props.location.state.product;
        const {cName1, cName2} = this.state;
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined
                        style={{color:'#1da57a',marginRight:10, fontSize:15}}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>Product Detail</span>
            </span>
        );
        const extra = '';
        return(
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>Product Name:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>Product Description:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>Product Price:</span>
                        <span>${price}</span>
                    </Item>
                    <Item>
                        <span className='left'>Product Category:</span>
                        <span>{cName1} {cName2 ? '--> ' + cName2 : ''}</span>
                    </Item>
                    <Item>
                        <span className='left'>Product Images:</span>
                        <span>
                            {
                                imgs.map(item => <img  key={item} src={BASE_IMG_URL + item} alt="image"/>)
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>Product Detail:</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}/>
                    </Item>
                </List>
            </Card>
        )
    }
}
