import React, { useState } from 'react'
import Togglable from './Togglable'

const Blog = ({ user, blog, likeBlog, deleteBlog }) => {
  const blogContentRef = React.createRef()

  const [showing, setShowing] = useState(false)

  return (
    <div className='blog'>
      <div>title: {blog.title}, {blog.author}</div>

      {showing && <>
        <div className="blog-url">url: {blog.url}</div>
        <div className="blog-likes">likes: {blog.likes}</div>
        <button className="like-button" onClick={() => likeBlog(blog.id)}>like</button>
      </>}

      <button onClick={() => setShowing(!showing)}>{showing ? "hide" : "show"}</button>
      {user.id === blog.user.id && <button onClick={() => deleteBlog(blog)}>delete</button>}

    </div>
  )
}

export default Blog