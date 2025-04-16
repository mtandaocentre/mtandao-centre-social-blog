import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { 
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import HomePage from './routes/HomePage.jsx'
import PostListPage from './routes/PostListPage.jsx'
import SinglePostPage from './routes/SinglePostPage.jsx'
import WritePage from './routes/WritePage.jsx'
import LoginPage from './routes/LoginPage.jsx'
import RegisterPage from './routes/RegisterPage.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ProfilePage from './routes/ProfilePage.jsx'
import EditProfilePage from './routes/EditProfilePage.jsx';  // Add this import

const queryClient = new QueryClient()

// Import your Publishable Key with error handler
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env.local file')
}

// create router
// Add routes
// Add navbar to all pages using MainLayout
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path:"/posts",
        element: <PostListPage />
      },
      {
        path:"/:slug",
        element: <SinglePostPage />
      },
      {
        path:"/write",
        element: <WritePage />
      },
      {
        path:"/login",
        element: <LoginPage />
      },
      {
        path:"/register",
        element: <RegisterPage />
      },
      {
        path:"/profile",
        element: <ProfilePage />
      },
      {
        path: "/profile/edit",  // Add this new route
        element: <EditProfilePage />  // This will show the Edit Profile Page
      }
    ]
  }
]);

// Wrap app with RouterProvider and parse router
// Wrap application with clerk provider
// Add publishable key
// Add Toast container
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position='bottom-right'/>
      </QueryClientProvider>
    </ClerkProvider> 
  </StrictMode>,
)
