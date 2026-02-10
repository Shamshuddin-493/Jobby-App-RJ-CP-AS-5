import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobsCard = props => {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = job
  return (
    <li className="similar-job-card-container">
      <div className="job-card-head-container">
        <img
          className="similar-company-logo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="title-container">
          <h1 className="title">{title}</h1>
          <div className="rating-container">
            <FaStar className="icon" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>

      <div>
        <h1 className="similar-desc-title">Description</h1>
        <p className="similar-desc">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default JobsCard
