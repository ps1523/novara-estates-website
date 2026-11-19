import { useMemo, useRef, useState } from 'react'
import type { PointerEvent, WheelEvent } from 'react'
import { Maximize, Minus, Plus } from 'lucide-react'
import type { Plot, Property } from '../data/properties'
import { formatPrice } from '../data/properties'

type Props = {
  property: Property
  selectedPlot: Plot | null
  onSelectPlot: (plot: Plot) => void
}

const viewWidth = 1080
const viewHeight = 580
const colors = { Available: '#738a62', Reserved: '#d49b52', Sold: '#81837c' }

export default function PlotMasterplan({ property, selectedPlot, onSelectPlot }: Props) {
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: viewWidth, height: viewHeight })
  const drag = useRef<{ x: number; y: number; box: typeof viewBox } | null>(null)
  const plots = property.plots ?? []
  const statistics = useMemo(() => ({
    total: plots.length,
    available: plots.filter(plot => plot.status === 'Available').length,
    reserved: plots.filter(plot => plot.status === 'Reserved').length,
    sold: plots.filter(plot => plot.status === 'Sold').length
  }), [plots])
  const plan = property.plotPlan

  const zoom = (factor: number) => setViewBox(current => {
    const width = Math.min(viewWidth, Math.max(510, current.width * factor))
    const height = width * viewHeight / viewWidth
    return { x: (viewWidth - width) / 2, y: (viewHeight - height) / 2, width, height }
  })

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    drag.current = { x: event.clientX, y: event.clientY, box: viewBox }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || event.buttons === 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - drag.current.x) * viewBox.width / rect.width
    const dy = (event.clientY - drag.current.y) * viewBox.height / rect.height
    setViewBox({ ...drag.current.box, x: drag.current.box.x - dx, y: drag.current.box.y - dy })
  }

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault()
    zoom(event.deltaY < 0 ? 0.9 : 1.1)
  }

  return <div className="plot-experience">
    <div className="plot-statistics" aria-label="Sample project statistics">
      <div><strong>{statistics.total}</strong><span>Sample plots</span></div>
      <div className="stat-available"><strong>{statistics.available}</strong><span>Available</span></div>
      <div className="stat-reserved"><strong>{statistics.reserved}</strong><span>Reserved</span></div>
      <div className="stat-sold"><strong>{statistics.sold}</strong><span>Sold</span></div>
      <div><strong>{plan?.totalLandAcres.toFixed(2) ?? '—'}</strong><span>Total acres · demo</span></div>
    </div>
    <div className="masterplan-shell">
      <div className="masterplan-toolbar">
        <span><i/> INTERACTIVE SAMPLE MASTERPLAN</span>
        <div>
          <button type="button" onClick={() => zoom(0.82)} aria-label="Zoom in"><Plus size={16}/></button>
          <button type="button" onClick={() => zoom(1.22)} aria-label="Zoom out"><Minus size={16}/></button>
          <button type="button" onClick={() => setViewBox({ x: 0, y: 0, width: viewWidth, height: viewHeight })} aria-label="Reset masterplan"><Maximize size={15}/></button>
        </div>
      </div>
      <svg className="masterplan-svg" viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} role="group" aria-label={`${property.name} interactive sample plot plan`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }} onWheel={handleWheel}>
        <g className="plan-compass" aria-label="North compass"><circle cx="1010" cy="72" r="25"/><path d="M1010 42 L1002 68 L1010 63 L1018 68 Z"/><text x="1010" y="106" textAnchor="middle">N</text></g>
        <rect x="14" y="12" width="1052" height="554" rx="8" fill="#e9e7da"/>
        <rect x="32" y="30" width="1016" height="518" rx="4" fill="#d9e0ca" stroke="#64765b" strokeWidth="3" strokeDasharray="9 6"/>
        <text x="42" y="51" className="plan-label">SAMPLE SITE BOUNDARY · NOT A SURVEY</text>
        <rect x="40" y="264" width="1000" height="28" fill="#c6c2b4"/>
        <text x="465" y="282" className="road-label">GREENWAY BOULEVARD · 40 FT SAMPLE ROAD</text>
        <rect x="490" y="66" width="36" height="400" fill="#c6c2b4"/>
        <text x="509" y="264" className="road-label vertical-road-label" transform="rotate(-90 509 264)">CENTRAL AVENUE · 30 FT SAMPLE ROAD</text>
        <rect x="58" y="486" width="145" height="46" rx="5" fill="#77916c"/>
        <text x="91" y="506" className="amenity-label">COMMUNITY PARK</text>
        <text x="84" y="521" className="amenity-sub-label">SAMPLE OPEN SPACE</text>
        <rect x="866" y="486" width="155" height="46" rx="5" fill="#899b78"/>
        <text x="903" y="506" className="amenity-label">AMENITY GARDEN</text>
        <text x="900" y="521" className="amenity-sub-label">SAMPLE COMMON AREA</text>
        <g className="plan-entry"><path d="M512 548 L512 530 M521 548 L521 530" stroke="#aa8b56" strokeWidth="4"/><text x="530" y="546" className="plan-label">ENTRY / EXIT</text></g>
        {plots.map((plot, index) => {
          const row = Math.floor(index / 10)
          const column = index % 10
          const x = 40 + column * 90 + (column >= 5 ? 55 : 0)
          const y = 69 + row * 64 + (row >= 3 ? 38 : 0)
          const isSelected = selectedPlot?.number === plot.number
          return <g key={plot.number} className={`masterplan-plot${isSelected ? ' is-selected' : ''}`} role="button" tabIndex={0} aria-label={`Plot ${plot.number}, ${plot.size}, ${formatPrice(plot.price)}, ${plot.status}`} aria-pressed={isSelected} onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); onSelectPlot(plot) }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectPlot(plot) } }}>
            <rect x={x} y={y} width="86" height="54" rx="3" fill={colors[plot.status]} stroke={isSelected ? '#222a24' : '#f7f5eb'} strokeWidth={isSelected ? 4 : 2}/>
            <text x={x + 43} y={y + 17} textAnchor="middle" className="plot-number-label">{plot.number}</text>
            <text x={x + 43} y={y + 32} textAnchor="middle" className="plot-size-label">{plot.size.replace(' sq.ft.', ' SF')}</text>
            <text x={x + 43} y={y + 45} textAnchor="middle" className="plot-size-label">{plot.dimensions}</text>
          </g>
        })}
        <text x="42" y="557" className="plan-label">ILLUSTRATIVE DEMO · ROADS, BOUNDARIES AND AMENITIES ARE NOT VERIFIED</text>
      </svg>
      <div className="masterplan-legend"><span><i className="legend-available"/> Available</span><span><i className="legend-reserved"/> Reserved</span><span><i className="legend-sold"/> Sold</span><span>Drag to pan · Scroll or buttons to zoom</span></div>
    </div>
    <div className="plot-detail-card" aria-live="polite">
      {selectedPlot ? <>
        <div className="plot-detail-title"><div><span className="eyebrow">SELECTED SAMPLE PLOT</span><h3>{selectedPlot.number}</h3></div><span className={`availability ${selectedPlot.status.toLowerCase()}`}>{selectedPlot.status}</span></div>
        <div className="plot-detail-grid"><div><span>Plot area</span><strong>{selectedPlot.size} · {selectedPlot.cents.toFixed(2)} cents</strong></div><div><span>Dimensions</span><strong>{selectedPlot.dimensions}</strong></div><div><span>Facing · sample</span><strong>{selectedPlot.facing}{selectedPlot.cornerDirection ? ` · ${selectedPlot.cornerDirection}` : ''}</strong></div><div><span>Road-facing side · sample</span><strong>{selectedPlot.roadFacingSide ?? 'Internal plot · no abutting road'}</strong></div></div>
        <div className="plot-detail-grid"><div><span>Price per sq.ft.</span><strong>₹{selectedPlot.pricePerSqFt.toLocaleString('en-IN')} / sq.ft.</strong></div><div><span>Road width · sample</span><strong>{selectedPlot.roadWidth}</strong></div></div>
        <div className="plot-boundaries" aria-label="Illustrative plot boundary details">
          <strong>Sample plot boundaries <span>Lengths in feet · demo</span></strong>
          <div><span>North</span><b>{selectedPlot.boundaries.north.neighbor}</b><small>{selectedPlot.boundaries.north.lengthFt} ft</small></div>
          <div><span>South</span><b>{selectedPlot.boundaries.south.neighbor}</b><small>{selectedPlot.boundaries.south.lengthFt} ft</small></div>
          <div><span>East</span><b>{selectedPlot.boundaries.east.neighbor}</b><small>{selectedPlot.boundaries.east.lengthFt} ft</small></div>
          <div><span>West</span><b>{selectedPlot.boundaries.west.neighbor}</b><small>{selectedPlot.boundaries.west.lengthFt} ft</small></div>
        </div>
        <div className="plot-detail-bottom"><strong>{formatPrice(selectedPlot.price)} <small>sample individual plot price</small></strong><a className="button button-dark" href={`https://wa.me/910000000000?text=${encodeURIComponent(`Hello NOVARA ESTATES, I am interested in sample plot ${selectedPlot.number} at ${property.name}. Please share more information.`)}`} target="_blank" rel="noreferrer">Enquire about this plot</a></div>
      </> : <div className="plot-empty-selection"><strong>Select a plot to explore</strong><span>Choose any coloured plot in the masterplan to see its sample dimensions, area, price and availability.</span></div>}
    </div>
    <div className="plot-area-summary">
      <strong>Land-use breakdown <span>Illustrative demo data</span></strong>
      <div><span>Sample plots</span><b>{plan?.plotAreaAcres.toFixed(2) ?? '—'} ac</b></div>
      <div><span>Internal roads</span><b>{plan?.roadAreaAcres.toFixed(2) ?? '—'} ac</b></div>
      <div><span>Open space</span><b>{plan?.openSpaceAcres.toFixed(2) ?? '—'} ac</b></div>
      <div><span>Amenities</span><b>{plan?.amenitiesAreaAcres.toFixed(2) ?? '—'} ac</b></div>
    </div>
    <details className="plot-inventory">
      <summary>Browse all {statistics.total} sample plots</summary>
      <div className="table-wrap"><table><thead><tr><th>Plot</th><th>Plot size</th><th>Dimensions</th><th>Facing</th><th>Sample price</th><th>Status</th></tr></thead><tbody>{plots.map(plot=><tr key={plot.number}><td><button className="plot-table-select" type="button" onClick={()=>onSelectPlot(plot)}>{plot.number}</button></td><td>{plot.size}</td><td>{plot.dimensions}</td><td>{plot.facing}</td><td>{formatPrice(plot.price)}</td><td><span className={`availability ${plot.status.toLowerCase()}`}>{plot.status}</span></td></tr>)}</tbody></table></div>
    </details>
    <p className="demo-disclaimer">Every plot dimension, status, price, boundary, access road and area shown here is sample data for this demonstration, not verified inventory or an approved site plan.</p>
  </div>
}
