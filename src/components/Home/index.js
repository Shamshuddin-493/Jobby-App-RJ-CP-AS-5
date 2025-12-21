import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import Header from '../Header'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <div>
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of people part of the daily air and it does not quite help
          that it changes all the time. Clothes have always been a marker of the
          era and we are in a revolution. Your fashion makes you been seen and
          heard that way you are
        </p>
        <Link to="/jobs">
          <button type="button">Find Jobs</button>
        </Link>
      </div>
    </>
  )
}
export default Home
