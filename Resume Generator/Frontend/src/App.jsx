import Resume from "./components/Resume"
import {BrowserRouter as Router,Routes,Route,useNavigate} from "react-router-dom"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { useState } from "react"
function App() {
 

  return (
    <>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
          </Routes>
        </div>

        <Footer />
      </Router>
    </>
  );
}

export default App
