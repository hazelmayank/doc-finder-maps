import React from 'react'
import DoctorForm from './components/DoctorForm'
import { Route, Routes } from 'react-router-dom'
import PatientSearch from './components/PatientSearch'
import HomeLanding from './components/HomeLanding'

const App = () => {
  return (
   <>
   <Routes>
    <Route path="/" element={<HomeLanding/>}></Route>
    <Route path="/doctor" element={<DoctorForm/>}></Route>
    <Route path="/patient" element={<PatientSearch/>}></Route>
   </Routes>
   </>
  )
}

export default App
