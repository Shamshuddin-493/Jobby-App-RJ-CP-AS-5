import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    searchInput,
    changeSearchInput,
    enterSearchInput,
    employmentTypesList,
    salaryRangesList,
    changeEmployment,
    activeEmployment, // ARRAY
    changeSalary,
    activeSalaryId,
  } = props

  /* ---------- SEARCH ---------- */

  const onChangeSearchInput = event => {
    changeSearchInput(event.target.value)
  }

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const renderSearchInput = () => (
    <div className="search-input-container">
      <input
        type="search"
        value={searchInput}
        className="search-input"
        placeholder="Search"
        onChange={onChangeSearchInput}
        onKeyDown={onEnterSearchInput}
      />
      <BsSearch className="search-icon" onClick={enterSearchInput} />
    </div>
  )

  /* ---------- EMPLOYMENT TYPES (MULTI SELECT) ---------- */

  const renderEmploymentTypesList = () =>
    employmentTypesList.map(type => {
      const isChecked = activeEmployment.includes(type.employmentTypeId)

      const onClickEmployment = () => {
        changeEmployment(type.employmentTypeId)
      }

      return (
        <li className="employment-item" key={type.employmentTypeId}>
          <input
            type="checkbox"
            id={type.employmentTypeId}
            checked={isChecked}
            onChange={onClickEmployment}
          />
          <label htmlFor={type.employmentTypeId}>{type.label}</label>
        </li>
      )
    })

  const renderEmploymentTypes = () => (
    <div className="employment-container">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="employment-list">{renderEmploymentTypesList()}</ul>
    </div>
  )

  /* ---------- SALARY RANGE (SINGLE SELECT) ---------- */

  const renderSalaryRangesList = () =>
    salaryRangesList.map(range => {
      const isChecked = activeSalaryId === range.salaryRangeId

      const onClickSalary = () => {
        changeSalary(range.salaryRangeId)
      }

      return (
        <li className="salary-item" key={range.salaryRangeId}>
          <input
            type="radio"
            id={range.salaryRangeId}
            name="salary"
            checked={isChecked}
            onChange={onClickSalary}
          />
          <label htmlFor={range.salaryRangeId}>{range.label}</label>
        </li>
      )
    })

  const renderSalaryRanges = () => (
    <div className="salary-container">
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="salary-list">{renderSalaryRangesList()}</ul>
    </div>
  )

  /* ---------- FINAL RENDER ---------- */

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
      {renderEmploymentTypes()}
      {renderSalaryRanges()}
    </div>
  )
}

export default FiltersGroup
