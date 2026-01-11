import { Routes, Route } from 'react-router-dom'
import Login_page from './Login_page'
import Homepage from './Homepage'
import Cashier from './Cashier'
import POSpage from './POSpage'

function Container_page() {
  return (
    <div
  className="main-parent"
  style={{
    backgroundColor: "red",
    width: "100vw",
    height: "100vh",
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "1fr",
  }}
  
>

      <Routes>
        <Route path="/" element={<Login_page />} />
        <Route path="/home_page" element={<Homepage />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/pos-menu" element={<POSpage />} />
      </Routes>
    </div>
  )
}

export default Container_page
