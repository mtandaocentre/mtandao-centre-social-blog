import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleKeyPress = (e) => {
    if(e.key === "Enter"){
      const query = e.target.value;
      if(location.pathname === "/posts"){
        setSearchParams({...Object.fromEntries(searchParams), search: query })
      }else{
        navigate(`/posts?search=${query}`)
      }
    }
  }

  return (
    <div className='bg-[#2a2a2a] p-2 rounded-lg flex items-center gap-2 border border-[#3a3a3a] w-full max-w-xs'>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="#e0e0e0"
        strokeWidth="2"
      >
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="16.5" y1="16.5" x2="22" y2="22" />
      </svg>
      <input 
        type="text" 
        placeholder="Search posts..." 
        className="bg-transparent text-[#e0e0e0] w-full focus:outline-none placeholder-[#7a7a7a] text-sm" 
        onKeyDown={handleKeyPress}
      />
    </div>
  )
}

export default Search