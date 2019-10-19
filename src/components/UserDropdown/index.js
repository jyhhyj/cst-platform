/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Icon, Menu } from 'antd';
import { connect } from 'react-redux';
import { loginOut } from '@/redux/actions';

const UserDropdown = ({ user, handleLoginOut }) => {
  return (
    <Dropdown className="user-dropdown" overlay={
      <Menu onClick={({ item, key, keyPath, domEvent }) => {
        handleLoginOut();
      }}>
        <Menu.Item key="0">
          <Link to="/sys">系统设置</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="#">个人中心</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">退出登录</Menu.Item>
      </Menu>
    } trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        hello, {user.surUserName} <Icon type="caret-down" />
      </a>
    </Dropdown>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleLoginOut: () => dispatch(loginOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDropdown);
