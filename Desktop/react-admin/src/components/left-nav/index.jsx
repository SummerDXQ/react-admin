import React,{Component} from "react";
import './index.less';
import logo from '../../assets/images/logo.png';
import {Link} from 'react-router-dom';
import { Menu } from 'antd';
import {
    AppstoreOutlined,
    MailOutlined,
} from '@ant-design/icons';
import menuList from "../../config/menuConfig";
import {withRouter} from 'react-router-dom';
import memoryUtils from "../../utils/memoryUtils";

const { SubMenu } = Menu;

class LeftNav extends Component{
    // user has authority or not
    hasAuth = (item) => {
        const {key, isPublic} = item;
        const menus = memoryUtils.user.role.menus;
        const {username} = memoryUtils.user
        if(username === 'admin' || isPublic || menus.indexOf(key) !== -1){
            return true
        }else if(item.children){
            return !!item.children.find(item => menus.indexOf(item.key) !== -1)
        }
        return false;
    }
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname;
        return menuList.reduce((prev,item) => {
            if(this.hasAuth(item)){
                // no children
                if(!item.children){
                    prev.push((
                        <Menu.Item
                            key={item.key}
                            icon={<AppstoreOutlined />}
                        >
                            <Link to={item.key}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    ))
                }else {
                    // child matches the pathname
                    const cItem = item.children.find(item => path.indexOf(item.key) === 0);
                    if(cItem){
                        this.openKey = item.key;
                    }
                    prev.push((
                        <SubMenu
                            key={item.key}
                            icon={<MailOutlined />}
                            title={item.title}
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return prev;
        },[])

        // return menuList.map(item => {
        //     if(!item.children){
        //         return (
        //             <Menu.Item key={item.key} icon={<AppstoreOutlined />}>
        //                 <Link to={item.key}>{item.title}</Link>
        //             </Menu.Item>
        //         )
        //     }else {
        //         const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
        //         if(cItem){
        //             this.openKey = item.key;
        //         }
        //         return(
        //             <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
        //                 {this.getMenuNodes(item.children)}
        //             </SubMenu>
        //         )
        //     }
        // })
    }
    componentWillMount() {
        this.menuNode = this.getMenuNodes(menuList);
    }

    render() {
        let path = this.props.location.pathname;
        const openKey = this.openKey;
        if (path.indexOf('/product')===0){
            path = '/product';
        }
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
