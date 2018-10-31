import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input, Popover,  } from 'antd'
import { config } from 'utils'
import styles from './index.less'

//import  Verification from 'components/Verification'
const FormItem = Form.Item

const Login = ({
                 loading,
                 dispatch,
                 form: {
                   getFieldDecorator,
                   validateFieldsAndScroll,
                 },
               }) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      console.log(values)
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  return (
    <div align={"center"}>

      <div className={styles.form} >
        <div className={styles.logo}>
          <img alt="logo" src={config.logo} />
          <span>{config.name}</span>
        </div>
        <form>
          <FormItem hasFeedback>
            {getFieldDecorator('account', {
              rules: [
                {
                  required: true,
                  pattern: /^1[34578]\d{9}$/,
                  message: '用户名不合法',
                },
              ],
            })(<Input onPressEnter={handleOk} placeholder="用户名" />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '密码不能为空',
                },
              ],
            })(<Input type="password" onPressEnter={handleOk} placeholder="密码" />)}
          </FormItem>

          <Row>
            <Button type="primary" onClick={handleOk} loading={loading.effects.login}>
              登 录
            </Button>
          </Row>

        </form>
      </div>

    </div>

  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
