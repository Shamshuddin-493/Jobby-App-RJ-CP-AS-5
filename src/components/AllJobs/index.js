import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import SearchJob from '../SearchJob'
import Profile from '../Profile'
import './index.css'

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

const locationsList = [
  {label: 'Hyderabad', locationId: 'HYDERABAD'},
  {label: 'Bangalore', locationId: 'BANGALORE'},
  {label: 'Chennai', locationId: 'CHENNAI'},
  {label: 'Delhi', locationId: 'DELHI'},
  {label: 'Mumbai', locationId: 'MUMBAI'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobsSection extends Component {
  timer = null

  controller = null

  state = {
    apiStatus: apiStatusConstants.initial,
    jobsData: [],
    selectedEmploymentTypes: [],
    minimumPackage: '',
    selectedLocations: [],
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
    if (this.controller) this.controller.abort()
  }

  getJobs = async () => {
    if (this.controller) {
      this.controller.abort()
    }

    this.controller = new AbortController()

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {selectedEmploymentTypes, minimumPackage, searchInput} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const employmentType = selectedEmploymentTypes.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchInput}`

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        signal: this.controller.signal,
      })

      if (response.ok) {
        const data = await response.json()
        const updatedData = data.jobs.map(job => ({
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          jobDescription: job.job_description,
          id: job.id,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
          title: job.title,
        }))

        this.setState({
          jobsData: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    }
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})

    if (this.timer) clearTimeout(this.timer)

    this.timer = setTimeout(() => {
      this.getJobs()
    }, 500)
  }

  clickSearch = () => {
    if (this.timer) clearTimeout(this.timer)
    this.getJobs()
  }

  updateSelectedEmploymentTypes = employmentTypeId => {
    this.setState(prevState => {
      const {selectedEmploymentTypes} = prevState
      const updatedList = selectedEmploymentTypes.includes(employmentTypeId)
        ? selectedEmploymentTypes.filter(id => id !== employmentTypeId)
        : [...selectedEmploymentTypes, employmentTypeId]

      return {selectedEmploymentTypes: updatedList}
    }, this.getJobs)
  }

  updateSalaryRange = minimumPackage => {
    this.setState({minimumPackage}, this.getJobs)
  }

  updateSelectedLocations = locId => {
    this.setState(prevState => {
      const {selectedLocations} = prevState
      const updatedList = selectedLocations.includes(locId)
        ? selectedLocations.filter(id => id !== locId)
        : [...selectedLocations, locId]

      return {selectedLocations: updatedList}
    }, this.getJobs)
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="job-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="job-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsListView = () => {
    const {jobsData} = this.state

    if (jobsData.length === 0) {
      return (
        <div className="no-jobs-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1>No Jobs Found</h1>
          <p>Try adjusting your filters.</p>
        </div>
      )
    }

    return (
      <ul className="job-list-container">
        {jobsData.map(job => (
          <JobCard key={job.id} jobsData={job} />
        ))}
      </ul>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="all-job-section">
        <div className="left-container">
          <Profile />
          <hr />
          <FiltersGroup
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            locationsList={locationsList}
            updateSelectedEmploymentTypes={this.updateSelectedEmploymentTypes}
            updateSalaryRange={this.updateSalaryRange}
            updateSelectedLocations={this.updateSelectedLocations}
          />
        </div>

        <div className="right-container">
          <SearchJob
            searchInput={searchInput}
            changeSearchInput={this.changeSearchInput}
            clickSearch={this.clickSearch}
          />
          {this.renderAllJobs()}
        </div>
      </div>
    )
  }
}

export default AllJobsSection
