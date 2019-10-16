import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Input, Skeleton, message } from 'antd';
// eslint-disable-next-line no-unused-vars
import { getPublicTemp, getStaticTemp, getUserDetail, getTempDetail, getEchartsList } from '@/api/index';
import { getToken } from '@/utils/auth';
import { Icon } from 'antd';
import _ from 'lodash';
const { Search } = Input;
// eslint-disable-next-line complexity
export default ({ setTempData, setTags, tags, handleCurIndex, curIndex, cRef }) => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [visible5, setVisible5] = useState(false);
  const [isShowPublicTemp, ShowPublicTemp] = useState(true);// 公共模块骨架屏
  const [isShowSingleTemp, ShowSingleTemp] = useState(true);// 个人模块骨架屏
  const [singleTemp, handleSingleTemp] = useState([]);// 个人模板
  const [publicTemp, handlePublicTemp] = useState([]);// 公共模板
  const [echartsList, handleEchartsList] = useState([]);
  const addTag = tag => {
    const fi = _.findIndex(tags, o => o.cucId === tag.cucId);
    if (fi < 0) {
      const t = _.clone(tags);
      t.push(tag);
      handleCurIndex(tag.cucId);
      setTags(t);
    }
  };
  const isExistCurIndex = (tags, curIndex) => {
    return tags.some(ele => {
      return curIndex === ele.cucId;
    });
  };
  useImperativeHandle(cRef, () => ({
    // changeVal 就是暴露给父组件的方法
    changeVal: (newVal) => {
      handleSingleTemp(newVal);
    }
  }));

  useEffect(() => {
    // Update the document title using the browser API
    // getStaticTemp();
    getEchartsList(getToken()).then(res => {
      handleEchartsList(res.data);
    });
    handlePublicTemp([]);
    getStaticTemp({ token: getToken() }).then(res => {
      if (res.data.rows.length) {
        // setTimeout(() => {
        console.log(res.data.rows);
        handleSingleTemp(res.data.rows);
        ShowSingleTemp(false);
        // }, 20000);
      }
    }).catch(err => {
      console.error(err);
    });
    ShowPublicTemp(false);
  },[]);
  return (
    <div className="panel-box" >
      <div className="panel-box-item">
        <div className="btn" onClick={() => setVisible1(!visible1)}>
          <span>工作台模板</span>
          <Icon style={{ marginLeft: '10px' }} type="double-left" />
        </div>
        <div className="content" style={{ paddingTop: visible1 ? 0 : '10px', maxHeight: visible1 ? 0 : '1000px' }}>
          <Search placeholder="请输入模板名称" onSearch={value => console.log(value)} />

          <div className="group-btn" onClick={() => setVisible2(!visible2)}>
            公共模板
            <span className="group-btn-iconbox">
              <Icon type="caret-down" />
            </span>
          </div>
          <ul className="group-list" style={{ paddingBottom: visible2 ? 0 : '10px', maxHeight: visible2 ? 0 : '1000px' }}>
            <Skeleton title={false} loading={ isShowPublicTemp } active>
              {
                publicTemp.map((tag, index) => (
                  <li key={index} onClick={
                    () => {
                      getTempDetail(getToken(), tag.cucId);
                    }
                  }>{tag.name}</li>
                ))
              }
            </Skeleton>
          </ul>

          <div className="group-btn" onClick={() => setVisible3(!visible3)}>个人模板<span className="group-btn-iconbox"><Icon type="caret-down" /></span></div>
          <ul className="group-list" style={{ paddingBottom: visible3 ? 0 : '10px', maxHeight: visible3 ? 0 : '1000px' }}>
            <Skeleton title={false} loading={ isShowSingleTemp } active>
              {
                singleTemp.map((tag, index) => (
                  <li key={tag.cucId} onClick={
                    () => {
                      getTempDetail(getToken(), tag.cucId).then(res => {
                        addTag(tag);
                      });
                    }
                  }>{tag.cucName}</li>
                ))
              }
            </Skeleton>
          </ul>

        </div>
      </div>
      <img style={{ margin: '10px 0' }} src={require('../../assets/images/l-panel.png')} alt="" />
      <div className="panel-box-item">
        <div className="btn" onClick={() => setVisible4(!visible4)}>应用套件<Icon style={{ marginLeft: '10px' }} type="double-left" /></div>
        <div className="content" style={{ paddingTop: visible4 ? 0 : '10px', maxHeight: visible4 ? 0 : '1000px' }}>
          <div className="temp-btn" onClick={() => setVisible5(!visible5)}>
            <span>大数据平台</span>
            <span className="temp-btn-iconbox">
              <Icon type="caret-down" />
            </span>
          </div>
          <ul className="temp-list" style={{ height: visible5 ? 0 : '200px' }}>
            <Skeleton title={false} loading={ isShowSingleTemp } active>
              {
                echartsList.map(item => (
                  <li draggable onDragStart={() => {
                    if (!isExistCurIndex(tags, curIndex)) {
                      // alert('请先选择模板');
                      message.warning('请先选择模板');
                      // return false;
                    } else {
                      setTempData({ isEcharts: true, type: 'bar', title: 'AB门管理', minW: 2, minH: 4, w: 4, h: 8 });
                    } }} unselectable="on" >
                    <img draggable={false} src={require('../../assets/images/tempIcons/1.png')} alt="" />
                    <div className="title">{item.name}</div>
                  </li>
                ))
              }
            </Skeleton>

            {/* <li draggable onDragStart={() => {
              if (!isExistCurIndex(tags, curIndex)) {
                // alert('请先选择模板');
                message.warning('请先选择模板');
                // return false;
              } else {
                setTempData({ isEcharts: true, type: 'bar', title: 'AB门管理', minW: 2, minH: 4, w: 4, h: 8 });
              } }} unselectable="on">
              <img src={require('../../assets/images/tempIcons/1.png')} alt="" />
              <div className="title">罪犯文化程度...</div>
            </li> */}
            {/* <li draggable onDragStart={() => setTempData({ isEcharts: true, type: 'line', title: '在监警力统计分析', minW: 2, minH: 4, w: 4, h: 8 })} unselectable="on" >
              <img draggable={false} src={require('../../assets/images/tempIcons/1.png')} alt="" />
              <div className="title">罪犯婚姻状况...</div>
            </li>
            <li draggable onDragStart={() => setTempData({ isEcharts: true, type: 'pie', title: '罪犯在押状态统计', w: 6, h: 8 })} unselectable="on" >
              <img src={require('../../assets/images/tempIcons/1.png')} alt="" />
              <div className="title">三类罪犯统计</div>
            </li>
            <li draggable onDragStart={() => setTempData({ isEcharts: true, type: 'scatter', title: '报警信息', w: 4, h: 8 })} unselectable="on" >
              <img src={require('../../assets/images/tempIcons/1.png')} alt="" />
              <div className="title">报警信息</div>
            </li>
            <li draggable onDragStart={() => setTempData({ isEcharts: true, type: 'gauge', title: '安全指数分析', w: 5, h: 12 })} unselectable="on" >
              <img src={require('../../assets/images/tempIcons/1.png')} alt="" />
              <div className="title">安全指数分析</div>
            </li>
            <li draggable onDragStart={() => setTempData({ isEcharts: false, type: 'gauge', title: '三类罪犯统计分析', w: 6, h: 10 })} unselectable="on" >
              <img src={require('../../assets/images/tempIcons/1.png')} alt="" />
              <div className="title">三类罪犯统计分析</div>
            </li> */}
            {/* <li>
              <img src={require('../../assets/images/tempIcons/1.png')} alt="" />
              <div className="title">罪犯危险性分...</div>
            </li>
            <li>
              <img src={require('../../assets/images/tempIcons/1.png')} alt="" />
              <div className="title">监狱安全指数</div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};
