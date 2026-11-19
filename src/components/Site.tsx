import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X, Instagram, Linkedin, Facebook, Phone, Mail, MapPin } from 'lucide-react'

export function Header() {
  const [open,setOpen]=useState(false); const loc=useLocation()
  const links=[['Home','/'],['Properties','/properties'],['Upcoming Projects','/upcoming'],['About','/about'],['Contact','/contact']]
  return <header className="header">
    <Link to="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark">N</span><span>NOVARA<small>ESTATES</small></span></Link>
    <nav className="desktop-nav">{links.map(([label,to])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>isActive?'active':''}>{label}</NavLink>)}</nav>
    <div className="header-actions"><Link to="/properties" className="search-link">Explore <ArrowUpRight size={15}/></Link><Link to="/contact" className="button button-dark button-small">Enquire Now</Link></div>
    <button className="mobile-toggle" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    {open&&<div className="mobile-nav">{links.map(([label,to])=><Link key={to} to={to} onClick={()=>setOpen(false)} className={loc.pathname===to?'active':''}>{label}</Link>)}<Link to="/contact" className="button button-dark" onClick={()=>setOpen(false)}>Enquire Now</Link></div>}
  </header>
}
export function Footer() {
  return <footer className="footer">
    <div className="footer-main">
      <div><Link to="/" className="brand brand-light"><span className="brand-mark">N</span><span>NOVARA<small>ESTATES</small></span></Link><p className="footer-tag">Discover Land. Design Life.<br/>Build Tomorrow.</p></div>
      <div><h4>Explore</h4><Link to="/properties">All properties</Link><Link to="/upcoming">Upcoming projects</Link><Link to="/about">Our story</Link></div>
      <div><h4>Get in touch</h4><span><MapPin size={15}/> Coimbatore, Tamil Nadu, India</span><span><Phone size={15}/> +91 00000 00000</span><span><Mail size={15}/> enquiries@novara.example</span></div>
      <div><h4>Follow our journey</h4><div className="socials"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram/></a><a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin/></a><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook/></a></div><p className="muted small">Social links are demo destinations.</p></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} NOVARA ESTATES. All rights reserved.</span><span>Fictional demo brand · Sample listings and prices only</span></div>
  </footer>
}
export function PageIntro({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
  return <section className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></section>
}
export function SectionTitle({eyebrow,title,copy,link}:{eyebrow?:string;title:string;copy?:string;link?:{label:string;to:string}}) {
  return <div className="section-title"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{copy&&<p>{copy}</p>}</div>{link&&<Link className="text-link" to={link.to}>{link.label} <ArrowUpRight size={16}/></Link>}</div>
}
