import { SignIn } from "@clerk/clerk-react"

// Add clerk signIn component and style it
// Add sign up url path to lead to register page
const LoginPage = () => {
  return (
    <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
      <SignIn signUpUrl="/register"/>
    </div>
  )
}

export default LoginPage