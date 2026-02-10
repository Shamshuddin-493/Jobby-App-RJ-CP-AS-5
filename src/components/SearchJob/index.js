import {BsSearch} from 'react-icons/bs'
import './index.css'

const SearchJob = props => {
  const {searchInput, changeSearchInput, clickSearch} = props
  const onSearchClick = () => {
    clickSearch()
  }

  const onChangeSearchInput = event => {
    changeSearchInput(event.target.value)
  }
  return (
    <div className="search-input-container">
      <input
        type="search"
        className="search-input"
        value={searchInput}
        placeholder="Search"
        onChange={onChangeSearchInput}
      />
      <button
        className="search-container"
        type="button"
        data-testid="searchButton"
        onClick={onSearchClick}
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )
}

export default SearchJob
