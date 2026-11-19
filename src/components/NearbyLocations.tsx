import { useState } from 'react'
import { Bus, GraduationCap, Hospital, MapPin, Plane, ShoppingBag, TrainFront, Waypoints } from 'lucide-react'
import type { NearbyPlace, Property } from '../data/properties'

const icons = {
  School: GraduationCap,
  College: GraduationCap,
  Hospital,
  'Bus stop': Bus,
  'Railway station': TrainFront,
  Airport: Plane,
  Shopping: ShoppingBag,
  'Main road': Waypoints
}

export default function NearbyLocations({ property }: { property: Property }) {
  const [selected, setSelected] = useState<NearbyPlace | null>(null)

  return <section className="nearby-section" aria-labelledby="nearby-heading">
    <div><span className="eyebrow">LOCATION & SURROUNDINGS</span><h2 id="nearby-heading">Places around this address</h2><p>{property.address}</p></div>
    <div className="nearby-map-layout">
      <div className="nearby-demo-map" role="group" aria-label="Illustrative property location map">
        <svg viewBox="0 0 640 370" role="img" aria-label="Not-to-scale illustrated map of sample nearby locations">
          <rect width="640" height="370" fill="#e8e7da"/>
          <path d="M-20 305 C128 244 206 322 331 264 S525 198 680 221" fill="none" stroke="#cbc7b5" strokeWidth="30"/>
          <path d="M180 -15 C205 80 153 126 222 215 S287 320 258 390" fill="none" stroke="#c9c5b4" strokeWidth="23"/>
          <path d="M-20 305 C128 244 206 322 331 264 S525 198 680 221" fill="none" stroke="#f8f6ed" strokeWidth="2" strokeDasharray="9 9"/>
          <path d="M180 -15 C205 80 153 126 222 215 S287 320 258 390" fill="none" stroke="#f8f6ed" strokeWidth="2" strokeDasharray="8 8"/>
          <text x="370" y="286" className="nearby-road-label">{property.location.split(',')[0]} · DEMO ROAD</text>
          <g className="nearby-property-pin"><circle cx="320" cy="170" r="25"/><path d="M320 209 L304 180 H336 Z"/><text x="320" y="174">N</text><text x="320" y="224" className="nearby-map-name">SAMPLE PROPERTY</text></g>
          <g className="nearby-compass"><circle cx="580" cy="57" r="20"/><path d="M580 34 L574 54 L580 50 L586 54 Z"/><text x="580" y="82">N</text></g>
          {property.nearby.map((place, index) => {
            const angle = -Math.PI / 2 + index * Math.PI * 2 / property.nearby.length
            const x = 320 + Math.cos(angle) * 114
            const y = 174 + Math.sin(angle) * 104
            return <g key={place.type} role="button" tabIndex={0} aria-label={`${place.name}, ${place.distanceKm} kilometres (illustrative)`} onClick={() => setSelected(place)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(place) } }}>
              <circle className={`nearby-place-dot${selected?.type === place.type ? ' active' : ''}`} cx={x} cy={y} r="9"/>
              <text className="nearby-map-label" x={x} y={y + 22} textAnchor="middle">{place.type}</text>
            </g>
          })}
        </svg>
        <span className="nearby-map-disclaimer">Illustrative, not-to-scale demo map. Distances and routes are not verified.</span>
      </div>
      <div className="nearby-place-list">{property.nearby.map(place => {
        const Icon = icons[place.type as keyof typeof icons] ?? MapPin
        return <button type="button" className={selected?.type === place.type ? 'active' : ''} key={place.type} onClick={() => setSelected(place)}>
          <Icon size={16}/><span><b>{place.name}</b><small>{place.type} · illustrative demo landmark</small></span><strong>{place.distanceKm < 1 ? `${Math.round(place.distanceKm * 1000)} m` : `${place.distanceKm.toFixed(1)} km`}</strong>
        </button>
      })}</div>
    </div>
    <div className="nearby-legend"><MapPin size={14}/><span>Fictional Coimbatore setting. Every landmark, location, distance and route is sample demo information and must not be used for navigation.</span></div>
  </section>
}
