import React from 'react'
import { Icon } from 'antd'
import styles from './index.less'
import { Page } from 'components'

const Error = () => (<Page inner>
  <div className={styles.error}>
    <Icon type="frown-o" />
    <h1>您不可以访问该资源</h1>
  </div>
</Page>)

export default Error
