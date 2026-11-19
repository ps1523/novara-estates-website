import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header,Footer } from './components/Site'
import Home from './pages/Home'
import Properties from './pages/Properties'
import Details from './pages/Details'
import Upcoming from './pages/Upcoming'
import About from './pages/About'
import Contact from './pages/Contact'
function ScrollToTop(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo({top:0,behavior:'instant'})},[pathname]);return null}
export default function App(){return <><ScrollToTop/><Header/><main><Routes><Route path="/" element={<Home/>}/><Route path="/properties" element={<Properties/>}/><Route path="/properties/:id" element={<Details/>}/><Route path="/projects/:id" element={<Details/>}/><Route path="/upcoming" element={<Upcoming/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<Home/>}/></Routes></main><Footer/></>}
