import React,{Component} from "react";
import memoryUtils from "../../utils/memoryUtils";
import {Redirect, Route, Switch} from 'react-router-dom'
import { Layout } from 'antd';
import Header from "../../components/header";
import LeftNav from "../../components/left-nav";
import Home from "../home/home";
import Product from "../product/product";
import Category from "../category/category";
import User from "../user/user";
import Role from "../role/role";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";



const { Footer, Sider, Content } = Layout;

export default class Admin extends Component{
    render() {
        const user = memoryUtils.user;
        if (!user || !user._id){
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{width:'100%',height:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    <Content style={{backgroundColor:'#fff'}}>
                        <Switch>
                            111
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center',color:'#ccc'}}>Recommend to use Chrome</Footer>
                </Layout>
            </Layout>
        )
    }
}