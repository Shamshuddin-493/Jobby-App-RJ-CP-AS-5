import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = props => {
  const onClickLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav>
      <div>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <Link to="/">
          <p>Home</p>
        </Link>
        <Link to="/jobs">
          <p>Jobs</p>
        </Link>
        <button type="button" onClick={onClickLogOut}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
