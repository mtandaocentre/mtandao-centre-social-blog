import Navbar from "./components/Navbar"

const App = () => {
  return (
    <div 
      /*Create padding to allow for screen size responsiveness*/
      className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'
    >
      {/* Render Navbar component in the main app */}
      <Navbar />
      {/* BREADCRUMB */}
      {/* INTRODUCTION */}
      {/* FEATURED POSTS */}
      {/* POST LIST */}
    </div>
  )
}

export default App