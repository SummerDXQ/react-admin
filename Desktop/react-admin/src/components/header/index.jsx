import React,{Component} from "react";
import './index.less';
import {formatDate} from '../../utils/dateUtils';
import memoryUtils from "../../utils/memoryUtils";
import {reqWeather} from "../../api";
import {withRouter} from 'react-router-dom';
import menuList from "../../config/menuConfig";
import { Modal } from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../link-button";


class Header extends Component{
    state = {
        currentTime : formatDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }

    getTime = () => {
        this.intervalId = setInterval(()=>{
            const currentTime = formatDate(Date.now());
            this.setState({currentTime});
        },1000)
    }

    getWeather = async () => {
        const {dayPictureUrl,weather} = await reqWeather('北京');
        this.setState({dayPictureUrl,weather});
    }

    getTitle = () => {
        const path = this.props.location.pathname;
        let title;
        menuList.forEach(item => {
            if(item.key === path){
                title = item.title;
            }else if(item.children){
                const cItem = item.children.find(item => item.key === path);
                if(cItem){
                    title = cItem.title;
                }
            }
        })
        return title;
    }

    // logout
    logout = () => {
        // show modal
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: 'Do you want to logout?',
            onOk:() => {
                storageUtils.removeUser();
                memoryUtils.user={};
            },
            onCancel:() => {
                return;
            }
        })
    }

    componentDidMount() {
        // get current time
        this.getTime();
        // get current weather
        this.getWeather();
    }

    // clear timer
    componentWillMount() {
        clearInterval(this.intervalId);
    }

    render() {
        const {currentTime, dayPictureUrl, weather } = this.state;
        const user = memoryUtils.user.username;
        const title = this.getTitle();
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>welcome, {user}</span>
                    <LinkButton onClick={()=>this.logout()}>Logout</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);
