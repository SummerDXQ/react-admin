import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from '../../api';
import {BASE_IMG_URL} from "../../utils/constants";


export default class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '', // preview image's url
        fileList: [],
    }

    constructor (props) {
        super(props);
        let fileList = [];
        // if imgs has data
        const {imgs} = this.props;
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }

        // initial status
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList
        }
    }

    // get all uploaded images
    getImgs  = () => {
        return this.state.fileList.map(file => file.name)
    }

    // hide Modal
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = file => {
        // preview image
        this.setState({
            previewImage: file.url || file.thumbUrl,  // file.thumbUrl: base64
            previewVisible: true,
        });
    };

    /*
    file: current image
    fileList: all uploaded images []
     */
    handleChange = async ({ file, fileList }) => {
        // change file info (name, url)
        if(file.status==='done') {
            const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: ''}}
            if(result.status===0) {
                message.success('Successfully upload image!')
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else {
                message.error('Upload image failed!')
            }
        } else if (file.status==='removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status===0) {
                message.success('Successfully delete image!!')
            } else {
                message.error('Delete image failed!!')
            }
        }

        // reset fileList
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload/"       /*upload image API*/
                    accept='image/*'
                    name='image'                      /*param name*/
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}