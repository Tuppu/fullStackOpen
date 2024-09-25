import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Toggleable from './components/Toggleable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const orderedBlogs = blogs.sort((a, b) => parseInt(b.likes) - parseInt(a.likes))
      
      setBlogs( orderedBlogs )
    }
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })
      
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      setUser(user)
      setUsername('')
      setPassword('')      
    } catch (exception) {
      setErrorMessage(exception?.response?.data?.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logUserOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createNewBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.hideVisibility();
      setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000) 
    } catch (exception) {
      setErrorMessage(exception?.response?.data?.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <Notification message={successMessage ?? errorMessage} type={successMessage ? 'success' : 'error'} />
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  if (user === null) {
    return (loginForm())
  }

  return (
    <div>
      <h1>blogs</h1>
        <Notification message={successMessage ?? errorMessage} type={successMessage ? 'success' : 'error'} />
        <p>{user.name} logged in <button onClick={() => logUserOut()}>logout</button></p>
        <Toggleable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm
            createNewBlog={createNewBlog}
          />
        </Toggleable>
      {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} setErrorMessage={setErrorMessage} />
      )}
    </div>
  )
}

export default App