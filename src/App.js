import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Footer from './components/Footer'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = React.createRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    if (returnedBlog.error) {
      setMessage(returnedBlog.error)
      setTimeout(() => {
        setMessage('')
      }, 5000)
      return null
    }
    setBlogs(blogs.concat(returnedBlog))
    setMessage('Successfully added blog')
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const addBlogLike = async (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    const returnedBlog = await blogService.update(id, changedBlog)
    if (returnedBlog.error) {
      setMessage(returnedBlog.error)
      setTimeout(() => {
        setMessage('')
      }, 5000)
      return null
    }
    setBlogs((blogs.map(blog => blog.id !== id ? blog : returnedBlog)))
    setMessage(`Liked blog "${blog.title}". Current likes: ${returnedBlog.likes}`)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const deleteBlog = async (deletableBlog) => {
    if (!window.confirm(`Are you sure you want to remove blog "${deletableBlog.title}" by ${deletableBlog.author}?`)) return null
    const id = deletableBlog.id
    const result = await blogService.remove(id)
    if (result.error) {
      setMessage(result.error)
      setTimeout(() => {
        setMessage('')
      }, 5000)
      return null
    }
    setBlogs(blogs.filter((b) => b.id !== id))
    setMessage(`Successfully deleted blog "${deletableBlog.title}".`)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('Successfully logged in')
      setTimeout(() => {
        setMessage('')
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUsername('')
    setPassword('')
    setUser(null)
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const blogForm = () => (
    <BlogForm createBlog={addBlog} />
  )

  return (
    <div>
      <Notification message={message} />
      {user == null ? loginForm() : <div>
        <h2>Blogs</h2>
        <div>{user.username} logged in</div>
        <button onClick={() => handleLogout()}>log out</button>
        <br></br>
        <br></br>

        <Togglable buttonLabel='create blog' ref={blogFormRef}>
          {blogForm()}
        </Togglable>

        <div>
          <h2>Current blogs</h2>
          <div>
            {blogs.sort((a, b) => a.likes > b.likes).map((blog, i) =>
              <Blog
                key={blog.id}
                user={user}
                likeBlog={addBlogLike}
                deleteBlog={deleteBlog}
                blog={blog}
              />
            )}
          </div>
        </div>
      </div>}
      <Footer />
    </div>
  )
}

export default App