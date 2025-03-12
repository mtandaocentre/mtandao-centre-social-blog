import Image from "./Image"
import { Link } from "react-router-dom"

const FeaturedPosts = () => {
  return (
    /* Add responsiveness */
    <div className='mt-8 flex flex-col lg:flex-row gap-8'>
        {/* - Divide featured post into two sections
            - Add w-full and h-full to all images to contain them in 
              their containers 
        */}
        
        {/* Fisrt post */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
        
          {/* Image */}
          {/* - Add and style image component 
              - Rename image src
              - Adjust image width for firts post
          */}
          <Image 
            src="featured0.jpeg" 
            className="rounded-3xl object-cover w-full h-full" 
            w="895"
          />

          {/* Details */}
          {/* Add and style detail section */}
          <div className="flex items-center gap-4">
              <h1 className="font-bold lg:text-lg">01.</h1>
              <Link className=" font-semibold text-[#e0e0e0] lg:text-lg">Hardware</Link>
              <span className="text-[#e0e0e0] font-medium">2 days ago</span>
          </div>

          {/* Title */}
          {/* Add title link */}
          <Link to="/test" 
            className="text-xl lg:text-3xl font-semibold lg:font-bold"
          >
            Your online place for everything computers.
          </Link>

        </div>

        {/* Other posts */}
        {/* - Add and style other featured posts 
            - Adjusted image width for other posts
        */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          
          {/* Second */}
          <div className="lg:h-1/3 flex justify-between gap-4">
            <div className="w-1/3 aspect-video">
              <Image 
                src="featured1.jpg"
                className="rounded-3xl object-cover w-full h-full"
                w="298"
              />
            </div>
          
            
            {/* Details and Titles */}
            <div className="w-2/3">
            
            {/* Details */}
            <div 
              className=" flex items-center gap-4 text-sm lg:text-base mb-4"
            >
              <h1 className="font-bold">02.</h1>
              <Link className="text-[#e0e0e0] font-semibold">Software</Link>
              <span className="text-[#e0e0e0] text-sm font-medium">2 days ago</span>
            </div>
            
            {/* Title */}
            <Link to="/test" 
              className="text-base sm:text-lg md:text-2xl lg:text-xl 
              xl:text-2xl font-medium"
            >
              Your online place for evrything computers
            </Link>
            </div>
          </div>

          {/* Third */}
          <div className="lg:h-1/3 flex justify-between gap-4">
            <div className="w-1/3 aspect-video">
              <Image 
                src="featured2.jpg"
                className="rounded-3xl object-cover w-full h-full"
                w="298"
              />
            </div>
          
            {/* Details and Titles */}
            <div className="w-2/3">
            
              {/* Details */}
              <div 
                className=" flex items-center gap-4 text-sm lg:text-base mb-4"
              >
                <h1 className="font-bold">03.</h1>
                <Link className="text-[#e0e0e0] font-semibold">Networks</Link>
                <span className="text-[#e0e0e0] text-sm font-medium">2 days ago</span>
              </div>

              {/* Title */}
              <Link to="/test" 
                className="text-base sm:text-lg md:text-2xl lg:text-xl 
                xl:text-2xl font-medium"
              >
                Your online place for evrything computers
              </Link>
            </div>
          </div>

          {/* Fourth */}
          <div className="lg:h-1/3 flex justify-between gap-4">
            <div className="w-1/3 aspect-video">
              <Image 
                src="featured3.jpeg"
                className="rounded-3xl object-cover w-full h-full"
                w="298"
              />
            </div>
          
            {/* Details and Titles */}
            <div className="w-2/3">
            
              {/* Details */}
                <div 
                  className=" flex items-center gap-4 text-sm lg:text-base mb-4"
                >
                  <h1 className="font-bold">04.</h1>
                  <Link className="text-[#e0e0e0] font-semibold">Distribute Systems</Link>
                  <span className="text-[#e0e0e0] text-sm font-medium">2 days ago</span>
                </div>
              
              {/* Title */}
                <Link to="/test" 
                  className="text-base sm:text-lg md:text-2xl lg:text-xl 
                  xl:text-2xl font-medium"
                >
                  Your online place for evrything computers
                </Link>
            </div>
          </div>
        </div>

    </div>
  )
}

export default FeaturedPosts