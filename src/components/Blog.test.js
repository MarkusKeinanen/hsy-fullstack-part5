import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

const blog = {
  title: 'testi title',
  author: 'testi author',
  url: 'testi.com',
  likes: 19,
  user: {
    id: "123"
  }
}
const user = {
  id: "123"
}

test('renders title and author but not url and likes', () => {
  const component = render(
    <Blog blog={blog} user={user} />
  )
  const blogElem = component.container.querySelector('.blog')
  expect(blogElem).toHaveTextContent('testi title')
  expect(blogElem).toHaveTextContent('testi author')
  expect(blogElem).not.toHaveTextContent('url')
  expect(blogElem).not.toHaveTextContent('likes')
})

test('renders url and likes after pressing show', () => {
  const component = render(
    <Blog blog={blog} user={user} />
  )
  const blogElem = component.container.querySelector('.blog')
  let button = component.getByText('show')
  fireEvent.click(button)
  expect(blogElem).toHaveTextContent('url')
  expect(blogElem).toHaveTextContent('likes')
})

test('pressing like twice sends 2 click events', async () => {
  const mockHandler = jest.fn()
  const component = render(
    <Blog blog={blog} user={user} likeBlog={mockHandler} />
  )
  let button = component.getByText('show')
  fireEvent.click(button)

  let likeButton = component.container.querySelector('.like-button')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls.length).toBe(2)
})