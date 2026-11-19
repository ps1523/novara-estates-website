import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Ruler } from 'lucide-react'
import type { Property } from '../data/properties'
import { formatPrice } from '../data/properties'
export default function PropertyCard({property}:{property:Property}) {
  return <article className="property-card">
    <Link to={`/properties/${property.id}`} className="property-image"><img src={property.image} alt={property.name} loading="lazy"/><span className="image-tag">{property.category}</span><span className="image-arrow"><ArrowUpRight size={18}/></span></Link>
    <div className="property-card-body"><div className="property-meta"><span><MapPin size={13}/>{property.location}</span><span>{property.status}</span></div>
      <Link to={`/properties/${property.id}`}><h3>{property.name}</h3></Link><div className="property-card-bottom"><div><strong>{formatPrice(property.price)}</strong><small>{property.category==='Plot'?'Individual plot price · demo': 'Sample asking price · demo'}</small></div><span><Ruler size={14}/>{property.size}</span></div>
    </div>
  </article>
}
