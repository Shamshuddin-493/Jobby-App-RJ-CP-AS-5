import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import './index.css'

const JobsCard = props => {
  const {jobsData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    id,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobsData
  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="jobs-card-container">
        <div className="job-card-head-container">
          <img
            className="company-logos"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="title-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <FaStar className="icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="place-container">
          <div className="icon-container">
            <div className="employment-location-container">
              <MdLocationOn className="job-icon" />
              <p className="title-icon">{location}</p>
            </div>
            <div className="employment-type-container">
              <BsBriefcaseFill className="job-icon" />
              <p className="title-icon">{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="hr" />
        <div>
          <h1 className="desc-title">Description</h1>
          <p className="desc-card">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobsCard
