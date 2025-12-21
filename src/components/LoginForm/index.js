import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

class LoginForm extends Component {
  state = {
    usernameInp: '',
    passwordInp: '',
    errorMsg: '',
    showSubmitError: false,
  }

  onChangeUsername = event => {
    this.setState({usernameInp: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passwordInp: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const apiUrl = 'https://apis.ccbp.in/login'
    const {usernameInp, passwordInp} = this.state
    const userDetails = {
      username: usernameInp,
      password: passwordInp,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  renderUsernameField = () => {
    const {usernameInp} = this.state
    return (
      <>
        <label htmlFor="username">USERNAME</label>
        <input
          type="password"
          id="username"
          value={usernameInp}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {passwordInp} = this.state
    return (
      <>
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          value={passwordInp}
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    const {showSubmitError, errorMsg} = this.state
    return (
      <div>
        <div>
          <form onSubmit={this.onSubmitForm}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
            <div>{this.renderUsernameField()}</div>
            <div>{this.renderPasswordField()}</div>
            <button type="submit">Login</button>
            {showSubmitError && <p>*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
