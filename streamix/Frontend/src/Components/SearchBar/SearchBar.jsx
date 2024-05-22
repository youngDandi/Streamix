import './SearchBar.css';
import searchIcon from '../../assets/img/icons8-search-50.png';

function SearchBar({type}) {
  return (
    <div className='searchContent'>
      <div className='searchWrapper'>
        <img src={searchIcon} alt="search" className="searchIcon" />
        <input placeholder={type} id='searchDiv' />
      </div>
    </div>

        
       
  );
}

export default SearchBar;
