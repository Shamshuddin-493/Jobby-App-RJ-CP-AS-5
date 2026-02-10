import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import SearchJob from '../SearchJob'
import Profile from '../Profile'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const locationsList = [
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },
  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobsSection extends Component {
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

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {selectedEmploymentTypes, minimumPackage, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const employmentType = selectedEmploymentTypes.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(details => ({
        companyLogoUrl: details.company_logo_url,
        employmentType: details.employment_type,
        jobDescription: details.job_description,
        id: details.id,
        location: details.location,
        packagePerAnnum: details.package_per_annum,
        rating: details.rating,
        title: details.title,
      }))
      this.setState({
        jobsData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  retryClick = () => {
    this.getJobs()
  }

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
      <button className="retry-btn" type="button" onClick={this.retryClick}>
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {jobsData, selectedLocations} = this.state
    const filteredDatas =
      selectedLocations.length === 0
        ? jobsData
        : jobsData.filter(e => selectedLocations.includes(e.location))
    return (
      <>
        {filteredDatas.length === 0 ? (
          <div className="no-jobs-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              className="no-jobs-img"
              alt="no jobs"
            />
            <h1 className="no-products-heading">No Jobs Found</h1>
            <p className="no-products-description">
              We could not find any jobs. Try other filters.
            </p>
          </div>
        ) : (
          <ul className="job-list-container">
            {filteredDatas.map(each => (
              <JobCard key={each.id} jobsData={each} />
            ))}
          </ul>
        )}
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  updateSelectedEmploymentTypes = employmentTypeId => {
    this.setState(prevState => {
      const {selectedEmploymentTypes} = prevState
      if (selectedEmploymentTypes.includes(employmentTypeId)) {
        return {
          selectedEmploymentTypes: selectedEmploymentTypes.filter(
            id => id !== employmentTypeId,
          ),
        }
      }
      return {
        selectedEmploymentTypes: [...selectedEmploymentTypes, employmentTypeId],
      }
    }, this.getJobs)
  }

  updateSalaryRange = minimumPackage => {
    this.setState({minimumPackage}, this.getJobs)
  }

  updateSelectedLocations = locId => {
    this.setState(prevState => {
      const {selectedLocations} = prevState
      if (selectedLocations.includes(locId)) {
        return {
          selectedLocations: selectedLocations.filter(id => id !== locId),
        }
      }
      return {
        selectedLocations: [...selectedLocations, locId],
      }
    }, this.renderAllJobs)
  }

  clickSearch = () => {
    this.getJobs()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
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
          <div className="job-search-container">
            <SearchJob
              searchInput={searchInput}
              changeSearchInput={this.changeSearchInput}
              clickSearch={this.clickSearch}
            />
          </div>
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
          <div className="job-search-container2">
            <SearchJob
              searchInput={searchInput}
              changeSearchInput={this.changeSearchInput}
              clickSearch={this.clickSearch}
            />
          </div>
          {this.renderAllJobs()}
        </div>
      </div>
    )
  }
}

export default AllJobsSection
