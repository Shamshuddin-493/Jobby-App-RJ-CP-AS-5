import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsStarFill} from 'react-icons/bs'

import './index.css'

const JobCard = props => {
  const {jobData} = props

  const {
    id,
    title,
    rating,
    companyLogoUrl,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobData

  return (
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="job-link">
        {/* TOP SECTION */}
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>

        {/* INFO ROW */}
        <div className="job-info">
          <div className="job-info-left">
            <div className="icon-text">
              <MdLocationOn />
              <p>{location}</p>
            </div>
            <div className="icon-text">
              <BsBriefcaseFill />
              <p>{employmentType}</p>
            </div>
          </div>

          <p className="package">{packagePerAnnum}</p>
        </div>

        <hr />

        {/* DESCRIPTION */}
        <h1 className="description-heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard
