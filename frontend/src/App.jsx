
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { FiBookmark, FiSearch, FiShare2, FiUser, FiHome } from 'react-icons/fi'
import { BsNewspaper } from 'react-icons/bs'
import Home from './pages/Home'
import ArticleDetail from './pages/ArticleDetail'
import Bookmarks from './pages/BookmarkPage'
import { BookmarkProvider } from './context/BookmarkContext'

function App() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })

  return (
    <BookmarkProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-black">
            <div className="container mx-auto px-4">
              {/* Top Header */}
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-6">
                  <Link to="/" className="flex items-center space-x-3">
                    <BsNewspaper className="w-8 h-8 text-nyt-black" />
                    <div>
                      <h1 className="text-2xl font-bold font-nyt-heading tracking-tight">
                        TangierTimes
                      </h1>
                      <p className="text-xs text-nyt-gray italic">Morocco's Premier English Daily</p>
                    </div>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="btn-nyt flex items-center space-x-2">
                    <FiUser className="w-4 h-4" />
                    <span>Subscribe</span>
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="border-t border-nyt-border py-3">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-6">
                    <Link to="/" className="text-sm font-semibold hover:text-nyt-gray">
                      <FiHome className="inline w-4 h-4 mr-1" />
                      Home
                    </Link>
                    <Link to="#" className="text-sm text-nyt-gray hover:text-nyt-black">
                      World
                    </Link>
                    <Link to="#" className="text-sm text-nyt-gray hover:text-nyt-black">
                      Politics
                    </Link>
                    <Link to="#" className="text-sm text-nyt-gray hover:text-nyt-black">
                      Business
                    </Link>
                    <Link to="#" className="text-sm text-nyt-gray hover:text-nyt-black">
                      Culture
                    </Link>
                    <Link to="#" className="text-sm text-nyt-gray hover:text-nyt-black">
                      Sports
                    </Link>
                    <Link to="/bookmarks" className="text-sm text-nyt-gray hover:text-nyt-black">
                      <FiBookmark className="inline w-4 h-4 mr-1" />
                      Bookmarks
                    </Link>
                  </div>
                  <div className="text-sm text-nyt-gray">
                    {today}
                  </div>
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-nyt-black text-white mt-auto">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">TangierTimes</h3>
                  <p className="text-gray-300 text-sm">
                    Delivering trusted journalism from Northern Morocco since 2024.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Sections</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><Link to="#" className="hover:text-white">Home</Link></li>
                    <li><Link to="#" className="hover:text-white">World</Link></li>
                    <li><Link to="#" className="hover:text-white">Politics</Link></li>
                    <li><Link to="#" className="hover:text-white">Business</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li><Link to="#" className="hover:text-white">About</Link></li>
                    <li><Link to="#" className="hover:text-white">Contact</Link></li>
                    <li><Link to="#" className="hover:text-white">Careers</Link></li>
                    <li><Link to="#" className="hover:text-white">Privacy</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Subscribe</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Get full digital access to TangierTimes.
                  </p>
                  <button className="btn-nyt-outline border-white text-white hover:bg-white/10">
                    Subscribe Now
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
                <p>© 2024 TangierTimes. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </BookmarkProvider>
  )
}

export default App
