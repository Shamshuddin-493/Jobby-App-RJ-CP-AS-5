import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {RiExternalLinkFill} from 'react-icons/ri'

import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const response = await fetch(apiUrl, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    if (response.ok) {
      const data = await response.json()

      const job = data.job_details
      const formattedJob = {
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        location: job.location,
        employmentType: job.employment_type,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
        companyWebsiteUrl: job.company_website_url,
        skills: job.skills.map(skill => ({
          name: skill.name,
          imageUrl: skill.image_url,
        })),
        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
      }

      const formattedSimilarJobs = data.similar_jobs.map(eachjob => ({
        id: eachjob.id,
        title: eachjob.title,
        rating: eachjob.rating,
        companyLogoUrl: eachjob.company_logo_url,
        location: eachjob.location,
        employmentType: eachjob.employment_type,
        jobDescription: eachjob.job_description,
      }))

      this.setState({
        jobDetails: formattedJob,
        similarJobsList: formattedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="job-details-failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We couldn&apos;t fetch job details. Please try again.</p>
      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderSkills = skills => (
    <ul className="skills-list">
      {skills.map(skill => (
        <li key={skill.name} className="skill-item">
          <img src={skill.imageUrl} alt={skill.name} />
          <p>{skill.name}</p>
        </li>
      ))}
    </ul>
  )

  renderJobDetailsView = () => {
    const {jobDetails, similarJobsList} = this.state
    const {
      title,
      rating,
      companyLogoUrl,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetails

    return (
      <>
        <div className="job-details-card">
          <div className="job-header">
            <img src={companyLogoUrl} alt="company logo" />
            <div>
              <h1>{title}</h1>
              <div className="rating-container">
                <BsStarFill />
                <p>{rating}</p>
              </div>
            </div>
          </div>

          <div className="job-info-row">
            <div className="job-info-left">
              <MdLocationOn />
              <p>{location}</p>
              <BsBriefcaseFill />
              <p>{employmentType}</p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr />

          <div className="description-header">
            <h1>Description</h1>
            <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
              Visit <RiExternalLinkFill />
            </a>
          </div>

          <p className="job-description">{jobDescription}</p>

          <h1 className="section-heading">Skills</h1>
          {this.renderSkills(skills)}

          <h1 className="section-heading">Life at Company</h1>
          <div className="life-at-company">
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>

        <h1 className="section-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsList.map(job => (
            <JobCard key={job.id} jobData={job} />
          ))}
        </ul>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state

    let content

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        content = this.renderLoadingView()
        break
      case apiStatusConstants.success:
        content = this.renderJobDetailsView()
        break
      case apiStatusConstants.failure:
        content = this.renderFailureView()
        break
      default:
        content = null
    }

    return (
      <>
        <Header />
        <div className="job-details-container">{content}</div>
      </>
    )
  }
}

export default JobItemDetails
