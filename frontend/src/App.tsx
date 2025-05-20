import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from './pages/Blogs'
import { Publish } from './pages/Publish'
import { MyBlogs } from './pages/MyBlogs'
import { UserProvider } from './context/UserContext'

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Blogs />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App