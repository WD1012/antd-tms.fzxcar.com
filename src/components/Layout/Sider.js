import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch } from 'antd'
import { config } from 'utils'
import styles from './Layout.less'
import Menus from './Menu'

const Sider = ({
  siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys, menu,
}) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  }

  return (
    <div>
      <div className={siderFold?styles.logo_small:styles.logo}>
        {siderFold ? <img alt="logo" src={darkTheme?config.logo_small_:config.logo_small} /> : <img alt="logo" src={darkTheme?config.logo_:config.logo} />}
        {siderFold ? '' : <span>{config.name}</span>}
      </div>
      <Menus {...menusProps} />
      {!siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />主题切换</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="变亮" unCheckedChildren="变暗" />
      </div> : ''}
    </div>
  )
}

Sider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider
