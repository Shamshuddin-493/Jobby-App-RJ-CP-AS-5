import './index.css'
import {BsStarFill} from 'react-icons/bs'
import {GoLocation} from 'react-icons/go'
import {MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'

const JobCard = ({jobDetails}) => {
  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails

  return (
    <li className="job-card">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="job-header">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="job-title-rating">
            <h1 className="job-title">{title}</h1>
            <div className="job-rating">
              <BsStarFill className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>

        <div className="job-details">
          <div className="job-location-type">
            <div className="location">
              <GoLocation className="location-icon" />
              <p>{location}</p>
            </div>
            <div className="employment-type">
              <MdWork className="employment-icon" />
              <p>{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>

        <hr className="separator" />
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard
