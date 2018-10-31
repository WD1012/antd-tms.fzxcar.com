import React from 'react'
import PropTypes from 'prop-types'
import { config, dvarequest } from 'utils'
import { getCookie } from '../../services/cookie'

const { api } = config
const { checkButtonResource } = api
class AuthButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      auth: false,
    }
  }

  componentWillMount () {
    // const user = JSON.parse(getCookie('token'))
    try {
      dvarequest(`${checkButtonResource}/${this.props.resourceId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        cache: 'default',
      }).then((response) => {
        this.setState({
          auth: response.data.data,
        })
      })
    } catch (e) {
      console.log('error')
    }
  }

  render () {
    const { child } = this.props
    const { auth } = this.state

    // return null
    return (auth ? child : null)
  }
}

AuthButton.propTypes = {
  resourceId: PropTypes.string,
  child: PropTypes.element.isRequired,
}

export default AuthButton
