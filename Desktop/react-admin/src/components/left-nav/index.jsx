import React,{Component,Fragment} from "react";
import './index.less';
import logo from '../../assets/images/logo.png';
import {Link} from 'react-router-dom';
import { Menu } from 'antd';
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
} from '@ant-design/icons';
import menuList from "../../config/menuConfig";
import {withRouter} from 'react-router-dom';

const { SubMenu } = Menu;

class LeftNav extends Component{
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname;
        return menuList.map(item => {
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={<AppstoreOutlined />}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            }else {
                const cItem = item.children.find(cItem => cItem.key === path);
                if(cItem){
                    this.openKey = item.key;
                }
                return(
                    <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    componentWillMount() {
        this.menuNode = this.getMenuNodes(menuList);
    }

    render() {

        const path = this.props.location.pathname;
        const openKey = this.openKey;
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>Admin Panel</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.menuNode}
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav);
