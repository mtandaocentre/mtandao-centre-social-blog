import { SignUp } from "@clerk/clerk-react"

// Added clerk sign up component and signInUrl path
const RegisterPage = () => {
  return (
    <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
      <SignUp signInUrl="/login"/>
    </div>
  )
}

export default RegisterPage