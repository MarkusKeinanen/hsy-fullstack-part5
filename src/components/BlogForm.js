import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <div>
          title:
          <input className="blog-form-title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
        </div>
        <div>
          author:
          <input className="blog-form-author" value={blogAuthor} onChange={(e) => setBlogAuthor(e.target.value)} />
        </div>
        <div>
          url:
          <input className="blog-form-url" value={blogUrl} onChange={(e) => setBlogUrl(e.target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm