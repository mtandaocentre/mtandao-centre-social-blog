const Search = () => {
  return (
    <div 
        /* Added margin bottom */
        className='mb-8 bg-[#e0e0e0] p-2 rounded-full flex items-center 
        gap-2'
    >
        {/* Changed svg stroke */}
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="#0f0f0f"
        >
            <circle cx="10.5" cy="10.5" r="7.5" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
        <input type="text" placeholder="Search" className="bg-transparent" />
    </div>
  )
}

export default Search