import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, BedDouble, Box, Camera, Check, MapPin, MessageCircle, Phone, Play, Ruler, X } from 'lucide-react'
import { formatPrice, properties, upcomingProjects } from '../data/properties'
import type { Plot, Property } from '../data/properties'
import PropertyCard from '../components/PropertyCard'
import EnquiryForm from '../components/EnquiryForm'
import PlotMasterplan from '../components/PlotMasterplan'
import ThreeViewer from '../components/ThreeViewer'
import NearbyLocations from '../components/NearbyLocations'
import { SectionTitle } from '../components/Site'

const demoVideo = '/media/novara-property-showcase-30s.mp4'

function MailIcon() {
  return <span className="mail-symbol">@</span>
}

function DetailOverview({ property, project, location, isProject }: {
  property: Property | undefined
  project: (typeof upcomingProjects)[number] | undefined
  location: string
  isProject: boolean
}) {
  return <section className="detail-overview container">
    <div><span className="eyebrow">AT A GLANCE</span><h2>{isProject ? 'A vision taking shape.' : 'The details that matter.'}</h2></div>
    <div className="overview-stats">
      <div><Ruler/><span>Size</span><strong>{property?.size || project!.area}</strong></div>
      <div><Box/><span>Category</span><strong>{property?.category || project!.type}</strong></div>
      <div><BedDouble/><span>Availability</span><strong>{property?.status || project!.status}</strong></div>
      <div><MapPin/><span>Location</span><strong>{location}</strong></div>
    </div>
  </section>
}

export default function Details() {
  const { id } = useParams()
  const property = properties.find(item => item.id === id)
  const project = upcomingProjects.find(item => item.id === id)
  const [lightbox, setLightbox] = useState(-1)
  const [show3d, setShow3d] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null)

  useEffect(() => {
    setVideoFailed(false)
    setSelectedPlot(null)
    setLightbox(-1)
    setShowVideo(false)
    setShow3d(false)
  }, [id])
  if (!property && !project) return <Navigate to="/properties" replace/>

  const isProject = !!project
  const name = property?.name || project!.name
  const location = property?.location || project!.location
  const heroImage = property?.image || project!.image
  const isPlot = property?.category === 'Plot' || !!project?.type.toLowerCase().includes('plotted')
  const images = property?.gallery || [
    project!.image,
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85'
  ]
  const related = property
    ? properties.filter(item => item.category === property.category && item.id !== property.id).slice(0, 3)
    : properties.slice(0, 3)
  const enquiryUrl = `https://wa.me/910000000000?text=${encodeURIComponent(`Hello NOVARA ESTATES, I am interested in ${name}. Please share more information.`)}`
  const videoUrl = property?.video || demoVideo

  return <>
    <section className="detail-hero">
      {videoFailed
        ? <img src={heroImage} alt={name}/>
        : <video className="detail-hero-video" autoPlay muted loop playsInline poster={heroImage} src={videoUrl} onError={() => setVideoFailed(true)}/>}
      <div className="detail-hero-shade"/>
      <div className="detail-hero-content">
        <Link to={isProject ? '/upcoming' : '/properties'} className="back-link"><ArrowLeft size={15}/> Back to {isProject ? 'upcoming projects' : 'properties'}</Link>
        <span className="eyebrow eyebrow-light">{isProject ? 'UPCOMING · PROPOSED PROJECT' : `${property!.category.toUpperCase()} COLLECTION`}</span>
        <h1>{name}</h1>
        <p><MapPin size={16}/>{location}</p>
        <div className="detail-price">{property ? formatPrice(property.price) : project!.area}<small>{property?.category === 'Plot' ? 'Individual sample plot price' : isProject ? 'Proposed project area' : 'Sample asking price'}</small></div>
        <button className="button button-gold" onClick={() => document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' })}>Enquire about this {isProject ? 'project' : 'property'} <ArrowUpRight size={16}/></button>
        <button className="button button-outline-light detail-film-button" onClick={() => setShowVideo(true)}><Play size={15}/> Watch this property's demo film</button>
      </div>
      <div className="hero-disclaimer">Illustrative demo media · Not actual project footage or an offer for sale</div>
    </section>

    <DetailOverview property={property} project={project} location={location} isProject={isProject}/>

    {property?.plots && <section className="plot-masterplan-section container" id="plot-plan">
      <div className="plot-section-heading"><div><span className="eyebrow">EXPLORE THE SITE</span><h2>Choose a plot. See the details.</h2><p>Click a coloured plot to view its illustrative dimensions, price and status.</p></div><div className="plot-section-actions"><span className="sample-badge">SAMPLE MASTERPLAN · DEMO DATA</span><button className="button button-dark" onClick={()=>setShow3d(true)}><Box size={15}/> Open 3D site view</button></div></div>
      <PlotMasterplan property={property} selectedPlot={selectedPlot} onSelectPlot={setSelectedPlot}/>
    </section>}

    <section className="detail-content container">
      <div className="detail-main">
        <div className="detail-block"><span className="eyebrow">THE STORY</span><h2>Designed around possibility.</h2>
          <p>{property?.description || project!.description}</p>
          <p>{property ? 'Every detail shown here is illustrative. Please independently verify approvals, title, dimensions, pricing, availability and specifications before making any property decision.' : 'This is a proposed concept for demonstration only. Final scope, specifications, approvals, location and timelines are subject to change and have not been confirmed.'}</p>
        </div>

        {property?.plotPlan && <div className="detail-block land-use-detail">
          <span className="eyebrow">SAMPLE LAND BREAKDOWN</span><h2>Space for the bigger picture.</h2>
          <div className="land-use-figures"><div><strong>{property.plotPlan.totalLandAcres.toFixed(2)} ac</strong><span>Total sample land · { (property.plotPlan.totalLandAcres * 0.404686).toFixed(2) } ha</span></div><div><strong>{property.plots?.length ?? 0}</strong><span>Sample plots</span></div><div><strong>{property.plotPlan.roadAreaAcres.toFixed(2)} ac</strong><span>Internal roads · sample</span></div><div><strong>{property.plotPlan.openSpaceAcres.toFixed(2)} ac</strong><span>Open space · sample</span></div></div>
          <p className="demo-disclaimer">All site areas and plot counts are illustrative demo data. They are not verified land measurements or approved plans.</p>
        </div>}

        <div className="detail-block gallery-block"><span className="eyebrow">A CLOSER LOOK</span><h2>Explore the spaces.</h2>
          <div className="property-video-gallery"><video controls preload="metadata" playsInline poster={heroImage} src={videoUrl} onError={() => setVideoFailed(true)}/><div><span className="eyebrow">PROPERTY-SPECIFIC DEMO CLIP</span><strong>{name}</strong><small>Original generated architectural visualization · Not actual property footage</small></div></div>
          <div className="gallery-grid">{images.map((image, index) => <button key={`${image}${index}`} onClick={() => setLightbox(index)}><img src={image} alt={`${name} illustrative gallery view ${index + 1}`} loading="lazy"/><span><Camera size={16}/> View</span></button>)}</div>
          <div className="media-actions"><button className="button button-outline-dark" onClick={() => setShowVideo(true)}><Play size={16}/> Play property demo film</button>{!isPlot&&<button className="button button-dark" onClick={() => setShow3d(true)}><Box size={16}/> Explore interactive 3D view</button>}</div>
        </div>

        <div className="detail-block"><span className="eyebrow">AMENITIES & FEATURES</span><h2>Thoughtful by design.</h2>
          <div className="feature-grid">{(property?.amenities || project!.features).map(feature => <span key={feature}><Check size={16}/>{feature}</span>)}</div>
          {property && <div className="feature-grid feature-secondary">{property.features.map(feature => <span key={feature}><Check size={16}/>{feature}</span>)}</div>}
        </div>

        {property&&<NearbyLocations property={property}/>}
        <div className="detail-block"><span className="eyebrow">PROPERTY INFORMATION</span><h2>More to know</h2>
          <div className="info-rows">
            <div><span>Full address</span><strong>{property?.address || `${project!.name}, ${project!.location} — proposed demo location`}</strong></div>
            <div><span>Nearby landmarks</span><strong>{property?.landmarks.join(' · ') || 'To be announced'}</strong></div>
            <div><span>Road connectivity</span><strong>{property?.connectivity || 'Details to be announced'}</strong></div>
            <div><span>Project status</span><strong>{property?.status || project!.status}</strong></div>
            {property?.plots && <div><span>Plot sample status</span><strong>35 available · 10 reserved · 15 sold — demo only</strong></div>}
          </div>
          <p className="demo-disclaimer">Nearby places, connections and status are sample information; no facilities, travel distances or availability have been independently verified.</p>
        </div>
      </div>

      <aside className="detail-aside">
        <div className="aside-card"><span className="eyebrow">INTERESTED?</span><h3>Let's talk about {isProject ? 'the vision' : 'your next move'}.</h3><p>Our team can help you understand the sample listing and next steps.</p>
          <a className="button button-dark full-button" href={enquiryUrl} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp enquiry</a>
          <a className="aside-phone" href="tel:+910000000000"><Phone size={15}/> +91 00000 00000 <small>Demo placeholder</small></a>
        </div>
        <div className="map-placeholder"><MapPin size={24}/><b>Location preview</b><span>{location}</span>
          <ul>{(property?.landmarks || []).map(item => <li key={item}>{item}</li>)}</ul>
          <small>Illustrative demo location. No verified map pin or distances available.</small>
        </div>
      </aside>
    </section>

    <section className="enquire-section" id="enquire"><div className="container enquire-layout">
      <div><span className="eyebrow eyebrow-light">MAKE AN ENQUIRY</span><h2>Every great place<br/>starts with a conversation.</h2><p>Share a few details and let us know what you'd like to explore.</p><div className="enquire-contact"><span><Phone size={16}/> +91 00000 00000</span><span><MailIcon/> enquiries@novara.example</span></div></div>
      <div className="enquire-form-wrap"><EnquiryForm propertyName={name} selectedPlotNumber={selectedPlot?.number}/></div>
    </div></section>

    <section className="section container"><SectionTitle eyebrow="KEEP EXPLORING" title="You may also like"/><div className="property-grid">{related.map(item => <PropertyCard key={item.id} property={item}/>)}</div></section>
    <a className="mobile-enquiry-bar" href="#enquire">Enquire about {name} <ArrowUpRight size={16}/></a>

    {lightbox >= 0 && <div className="modal-backdrop" onClick={() => setLightbox(-1)}><button className="modal-close" aria-label="Close gallery" onClick={() => setLightbox(-1)}><X/></button><img className="lightbox-image" src={images[lightbox]} alt={`${name} enlarged gallery view`} onClick={event => event.stopPropagation()}/><button className="lightbox-prev" aria-label="Previous image" onClick={event => { event.stopPropagation(); setLightbox((lightbox + images.length - 1) % images.length) }}>‹</button><button className="lightbox-next" aria-label="Next image" onClick={event => { event.stopPropagation(); setLightbox((lightbox + 1) % images.length) }}>›</button></div>}

    {show3d && <div className="modal-backdrop modal-3d" onClick={() => setShow3d(false)}><div className="viewer-modal" onClick={event => event.stopPropagation()}>
      <div className="viewer-modal-head"><div><span className="eyebrow">INTERACTIVE DEMO MODEL</span><h3>{name} · 3D experience</h3></div><button aria-label="Close 3D view" onClick={() => setShow3d(false)}><X/></button></div>
      <ThreeViewer category={property?.category || (isPlot ? 'Plot' : 'Villa')} property={property} plots={property?.plots} selectedPlot={selectedPlot} onSelectPlot={setSelectedPlot}/>
      <p className="model-note">{property?.category === 'Plot' ? 'Procedural illustrative site model for demonstration. It is not a surveyed site plan or a verified project model.' : 'Open-sided, furnished procedural dollhouse model for demonstration. It is not a verified architectural design or a construction plan.'}</p>
    </div></div>}

    {showVideo && <div className="modal-backdrop" onClick={() => setShowVideo(false)}><button className="modal-close" aria-label="Close video" onClick={() => setShowVideo(false)}><X/></button>
      <div className="video-modal" onClick={event => event.stopPropagation()}>{videoFailed ? <img className="video-fallback" src={heroImage} alt={`${name} illustrative property view`}/> : <video controls autoPlay muted playsInline poster={heroImage} src={videoUrl} onError={() => setVideoFailed(true)}/>}<p>Original, property-specific architectural demonstration clip · Not actual completed property footage.</p></div>
    </div>}
  </>
}
