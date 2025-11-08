import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Home from './pages/Home'
import Fashion from './pages/Fashion'
import Luxury from './pages/Luxury'
import Lifestyle from './pages/Lifestyle'
import Beauty from './pages/Beauty'
import Travel from './pages/Travel'
import Events from './pages/Events'
import Sports from './pages/Sports'
import Videos from './pages/Videos'
import Cartoons from './pages/Cartoons'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="fashion" element={<Fashion />} />
          <Route path="luxury" element={<Luxury />} />
          <Route path="lifestyle" element={<Lifestyle />} />
          <Route path="beauty" element={<Beauty />} />
          <Route path="travel" element={<Travel />} />
          <Route path="events" element={<Events />} />
          <Route path="sports" element={<Sports />} />
          <Route path="videos" element={<Videos />} />
          <Route path="cartoons" element={<Cartoons />} />
          <Route path="search" element={<Search />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
