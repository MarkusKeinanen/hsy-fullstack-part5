import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> calls the passed down createBlog function with correct props from input fields', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const titleInput = component.container.querySelector('.blog-form-title')
  const authorInput = component.container.querySelector('.blog-form-author')
  const urlInput = component.container.querySelector('.blog-form-url')

  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: 'test title' }
  })
  fireEvent.change(authorInput, {
    target: { value: 'test author' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'test url' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)

  const formContents = createBlog.mock.calls[0][0]

  expect(formContents.title).toBe('test title')
  expect(formContents.author).toBe('test author')
  expect(formContents.url).toBe('test url')
})