import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import Headers from '../Header'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileDetails: {},
    apiJobsStatus: apiStatusConstants.initial,
    apiProfileStatus: apiStatusConstants.initial,
    activeEmployment: [], // ✅ ARRAY
    activeSalaryId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsList()
  }

  /* ---------- PROFILE ---------- */

  getProfile = async () => {
    this.setState({apiProfileStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    if (response.ok) {
      const data = await response.json()
      const details = data.profile_details

      this.setState({
        profileDetails: {
          name: details.name,
          profileImageUrl: details.profile_image_url,
          shortBio: details.short_bio,
        },
        apiProfileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusConstants.failure})
    }
  }

  /* ---------- JOBS ---------- */

  getJobsList = async () => {
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})

    const {activeEmployment, activeSalaryId, searchInput} = this.state
    const employmentType = activeEmployment.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activeSalaryId}&search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch(apiUrl, {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })

    if (response.ok) {
      const data = await response.json()
      const jobs = data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        rating: job.rating,
        companyLogoUrl: job.company_logo_url,
        location: job.location,
        employmentType: job.employment_type,
        packagePerAnnum: job.package_per_annum,
        jobDescription: job.job_description,
      }))

      this.setState({
        jobsList: jobs,
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusConstants.failure})
    }
  }

  /* ---------- FILTER HANDLERS ---------- */

  changeEmployment = id => {
    this.setState(prevState => {
      const alreadySelected = prevState.activeEmployment.includes(id)

      return {
        activeEmployment: alreadySelected
          ? prevState.activeEmployment.filter(each => each !== id)
          : [...prevState.activeEmployment, id],
      }
    }, this.getJobsList)
  }

  changeSalary = id => {
    this.setState({activeSalaryId: id}, this.getJobsList)
  }

  changeSearchInput = value => {
    this.setState({searchInput: value})
  }

  enterSearchInput = () => {
    this.getJobsList()
  }

  /* ---------- RENDER ---------- */

  renderJobsList = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(job => (
          <JobCard jobData={job} key={job.id} />
        ))}
      </ul>
    )
  }

  render() {
    const {activeEmployment, activeSalaryId, searchInput, apiJobsStatus} =
      this.state

    return (
      <>
        <Headers />
        <div className="jobs-container">
          <FiltersGroup
            searchInput={searchInput}
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            changeSearchInput={this.changeSearchInput}
            enterSearchInput={this.enterSearchInput}
            activeEmployment={activeEmployment}
            activeSalaryId={activeSalaryId}
            changeEmployment={this.changeEmployment}
            changeSalary={this.changeSalary}
          />

          {apiJobsStatus === apiStatusConstants.inProgress && (
            <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
          )}

          {apiJobsStatus === apiStatusConstants.success &&
            this.renderJobsList()}
        </div>
      </>
    )
  }
}

export default Jobs
