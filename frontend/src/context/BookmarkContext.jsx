import React, { createContext, useEffect, useState } from 'react'

export const BookmarkContext = createContext()

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tt_bookmarks')
      if (raw) setBookmarks(JSON.parse(raw))
    } catch (e) {
      console.warn('Failed to load bookmarks', e)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tt_bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  function toggleBookmark(article) {
    setBookmarks((prev) => {
      const exists = prev.find((p) => p.id === article.id)
      if (exists) return prev.filter((p) => p.id !== article.id)
      return [article, ...prev]
    })
  }

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  )
}
