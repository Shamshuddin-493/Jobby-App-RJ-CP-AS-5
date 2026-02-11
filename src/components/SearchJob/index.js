import {useRef} from 'react'
import {BsSearch} from 'react-icons/bs'
import './index.css'

const SearchJob = ({searchInput, changeSearchInput, clickSearch}) => {
  const inputRef = useRef(null)

  const onChangeSearchInput = event => {
    changeSearchInput(event.target.value)
  }

  const onSearchClick = () => {
    if (searchInput.trim() === '') {
      inputRef.current.focus()
    } else {
      clickSearch()
    }
  }

  return (
    <div className="search-input-container">
      <input
        ref={inputRef}
        type="search"
        className="search-input"
        value={searchInput}
        placeholder="Search"
        onChange={onChangeSearchInput}
      />
      <button
        type="button"
        className="search-container"
        data-testid="searchButton"
        onClick={onSearchClick}
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )
}

export default SearchJob
