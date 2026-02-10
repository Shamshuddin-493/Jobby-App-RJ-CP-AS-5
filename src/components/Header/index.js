import {Link, withRouter} from 'react-router-dom'
import './index.css'
import Cookies from 'js-cookie'
import {MdHome} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar-header">
      <div className="navbar-content">
        <div className="navbar-mobile-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="menu-mobile-container">
            <li className="menu-item">
              <Link to="/" className="nav-link">
                <MdHome />
              </Link>
            </li>
            <li className="menu-item">
              <Link to="/jobs" className="nav-link">
                <BsBriefcaseFill />
              </Link>
            </li>
            <li className="menu-item">
              <button
                className="btn-link"
                type="button"
                onClick={onClickLogout}
                aria-label="Mobile"
              >
                <FiLogOut />
              </button>
            </li>
          </ul>
        </div>
        <div className="navbar-large-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/jobs" className="nav-link">
                Jobs
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="logout-btn"
            onClick={onClickLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
