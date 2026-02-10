import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import SimilarJobs from '../SimilarJobs'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobsData()
  }

  getFormattedData = details => ({
    companyLogoUrl: details.company_logo_url,
    employmentType: details.employment_type,
    jobDescription: details.job_description,
    id: details.id,
    location: details.location,
    packagePerAnnum: details.package_per_annum,
    rating: details.rating,
    title: details.title,
    companyWebsiteUrl: details.company_website_url,
    skills: details.skills.map(each => ({
      imageUrl: each.image_url,
      name: each.name,
    })),
    lifeAtCompany: {
      imageUrl: details.life_at_company.image_url,
      description: details.life_at_company.description,
    },
  })

  getJobsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.job_details)
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(details => ({
        companyLogoUrl: details.company_logo_url,
        employmentType: details.employment_type,
        jobDescription: details.job_description,
        id: details.id,
        location: details.location,
        rating: details.rating,
        title: details.title,
      }))
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  retryClick = () => {
    this.getJobsData()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="job-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="job-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.retryClick}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobData

    return (
      <>
        <div className="job-card-container">
          <div className="job-card-head-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
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
            <div className="description-container">
              <h1 className="desc-title">Description</h1>
              <a className="visit-container" href={companyWebsiteUrl}>
                <p className="visit">Visit</p>
                <FaExternalLinkAlt />
              </a>
            </div>
            <p className="desc">{jobDescription}</p>
          </div>
          <h1 className="skill-title">SKills</h1>
          <ul className="skills-container">
            {skills.map(each => (
              <li className="skill-item-container" key={each.name}>
                <img
                  src={each.imageUrl}
                  className="skill-img"
                  alt={each.name}
                />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <div className="company-description-container">
            <h1 className="desc-title">Life at Company</h1>
            <div className="company-container">
              <p className="desc-company">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                className="company-img"
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div className="similiar-job-container">
          <h1 className="similar-heading">Similar Jobs</h1>
          <ul className="similar-card-container">
            {similarJobsData.map(each => (
              <SimilarJobs key={each.id} job={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderjobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderjobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
