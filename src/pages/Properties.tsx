import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react'
import { properties,formatPrice } from '../data/properties'
import PropertyCard from '../components/PropertyCard'
import { PageIntro } from '../components/Site'
export default function Properties(){
 const [params]=useSearchParams()
 const [category,setCategory]=useState(params.get('category')||'All')
 const [location,setLocation]=useState(params.get('location')||'')
 const [maxPrice,setMaxPrice]=useState(params.get('budget')||'')
 const [sort,setSort]=useState('featured');const [view,setView]=useState<'grid'|'list'>('grid')
 const filtered=useMemo(()=>properties.filter(p=>(category==='All'||p.category.toLowerCase()===category.toLowerCase())&&(!location||p.location.toLowerCase().includes(location.toLowerCase())||p.address.toLowerCase().includes(location.toLowerCase()))&&(!maxPrice||p.price<=Number(maxPrice))).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:0),[category,location,maxPrice,sort])
 const clear=()=>{setCategory('All');setLocation('');setMaxPrice('');setSort('featured')}
 return <><PageIntro eyebrow="THE COLLECTION" title="Find your somewhere." description="Explore our sample collection of plotted developments, villas and modern homes. Every listing and price on this demo site is fictional."/>
 <section className="container listing-layout"><aside className="filters"><div className="filter-head"><h3><SlidersHorizontal size={17}/> Refine search</h3><button onClick={clear}>Clear all</button></div><label>Property type<select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option><option>Plot</option><option>Villa</option><option>Home</option></select></label><label>Location<input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Search a location"/></label><label>Maximum project price<select value={maxPrice} onChange={e=>setMaxPrice(e.target.value)}><option value="">Any price</option><option value="8000000">Under ₹80 Lakh</option><option value="12000000">Under ₹1.2 Cr</option><option value="15000000">Under ₹1.5 Cr</option><option value="20000000">Under ₹2 Cr</option><option value="25000000">Under ₹2.5 Cr</option></select></label><div className="filter-disclaimer">Sample inventory only. Prices are illustrative and are not verified market prices.</div></aside>
 <div className="results"><div className="results-toolbar"><span><strong>{filtered.length}</strong> properties found</span><div className="toolbar-controls"><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Sort: Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select><button className={view==='grid'?'view-active':''} onClick={()=>setView('grid')} aria-label="Grid view"><LayoutGrid size={17}/></button><button className={view==='list'?'view-active':''} onClick={()=>setView('list')} aria-label="List view"><List size={17}/></button></div></div>
 {filtered.length?<div className={`property-grid ${view==='list'?'list-view':''}`}>{filtered.map(p=><PropertyCard key={p.id} property={p}/>)}</div>:<div className="empty-state"><div><X size={25}/></div><h3>No properties match those filters.</h3><p>Try changing your location or widening your budget.</p><button className="button button-dark" onClick={clear}>Clear filters</button></div>}
 </div></section></>
}
