export type PlotBoundary = { neighbor: string; lengthFt: number }
export type Plot = {
  number: string
  size: string
  areaSqFt: number
  dimensions: string
  frontageFt: number
  depthFt: number
  price: number
  pricePerSqFt: number
  status: 'Available' | 'Reserved' | 'Sold'
  facing: string
  roadFacingSide: string | null
  roadWidth: string
  cents: number
  corner: boolean
  cornerDirection: string | null
  boundaries: { north: PlotBoundary; south: PlotBoundary; east: PlotBoundary; west: PlotBoundary }
}
export type PlotPlan = {
  totalLandAcres: number
  plotAreaAcres: number
  roadAreaAcres: number
  openSpaceAcres: number
  amenitiesAreaAcres: number
}
export type NearbyPlace = { type: string; name: string; distanceKm: number }
export type RoomSpec = { name: string; widthFt: number; depthFt: number; role: 'living' | 'kitchen' | 'bedroom' | 'dining' | 'bathroom' | 'balcony' | 'staircase' | 'utility' }
export type DesignProfile = {
  style: string
  exterior: string
  roof: string
  accent: string
  glass: string
  interior: string
  furniture: string
  stories: number
  pool: boolean
  signature: string
}
export type Property = {
  id: string
  name: string
  category: 'Plot' | 'Villa' | 'Home'
  location: string
  address: string
  size: string
  landArea?: string
  price: number
  description: string
  status: string
  image: string
  gallery: string[]
  video: string
  amenities: string[]
  features: string[]
  landmarks: string[]
  nearby: NearbyPlace[]
  connectivity: string
  plots?: Plot[]
  plotPlan?: PlotPlan
  rooms?: RoomSpec[]
  design: DesignProfile
  units: number
  phone: string
  email: string
}

const photo = (id: string, width = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const commonAmenities = ['Landscape garden concept', 'Entry gate concept', 'Natural daylight', 'Illustrative demo information']
const addresses = [
  'Saravanampatti', 'Kalapatti', 'Vadavalli', 'Sulur', 'Thudiyalur',
  'Race Course', 'Peelamedu', 'Vadavalli', 'RS Puram', 'Saibaba Colony',
  'Peelamedu', 'Vellakinar', 'Saravanampatti', 'Kuniyamuthur'
]
const roads = ['Avinashi Road', 'Sathy Road', 'Mettupalayam Road', 'Trichy Road', 'Perur Road']
const sceneIds = [
  'photo-1500382017468-9049fed747ef',
  'photo-1449158743715-0a90ebb6d2d8',
  'photo-1510798831971-661eb04b3739',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1600607687939-ce8a6c25118c',
  'photo-1600585154340-be6161a56a0c',
  'photo-1600566753086-00f18fb6b3ea',
  'photo-1600607687920-4e2a09cf159d',
  'photo-1600607687644-c7171b42498f',
  'photo-1600566753190-17f0baa2a6c3',
  'photo-1600047509807-ba8f99d2cdde',
  'photo-1600210492486-724fe5c67fb0',
  'photo-1600047508788-786f3860d3f0'
]
const plotListings = [
  { id: 'novara-green-valley', name: 'NOVARA Green Valley', area: 1200, price: 1800000, frontage: 30, depth: 40, style: 'Garden neighbourhood' },
  { id: 'novara-royal-gardens', name: 'NOVARA Royal Gardens', area: 1500, price: 2400000, frontage: 30, depth: 50, style: 'Formal landscaped community' },
  { id: 'novara-silver-county', name: 'NOVARA Silver County', area: 1800, price: 2900000, frontage: 30, depth: 60, style: 'Woodland-edge layout' },
  { id: 'novara-sunrise-estate', name: 'NOVARA Sunrise Estate', area: 2400, price: 3800000, frontage: 40, depth: 60, style: 'Sunrise garden enclave' },
  { id: 'novara-golden-meadows', name: 'NOVARA Golden Meadows', area: 3000, price: 4800000, frontage: 50, depth: 60, style: 'Open-meadow community' }
] as const
const villaListings = [
  { id: 'novara-grand-horizon-villa', name: 'NOVARA Grand Horizon Villa', price: 12500000, size: '3,200 sq.ft. built-up', style: 'Contemporary pavilion', exterior: '#ded4c2', roof: '#49534b', accent: '#a77d50', glass: '#557881', interior: '#d3bd9e', furniture: '#68756a', stories: 2, pool: false, signature: 'Double-height entry and garden terrace', image: sceneIds[5] },
  { id: 'novara-white-stone-villa', name: 'NOVARA White Stone Villa', price: 15000000, size: '3,600 sq.ft. built-up', style: 'Limestone courtyard villa', exterior: '#ece8df', roof: '#72746c', accent: '#c4ae88', glass: '#66838a', interior: '#e6ded0', furniture: '#7c6755', stories: 2, pool: true, signature: 'Pale stone, sheltered court and plunge pool', image: sceneIds[6] },
  { id: 'novara-emerald-villa', name: 'NOVARA Emerald Villa', price: 18000000, size: '4,100 sq.ft. built-up', style: 'Tropical modern villa', exterior: '#cdb99b', roof: '#434c41', accent: '#6f855f', glass: '#486f73', interior: '#cbb89c', furniture: '#4d6554', stories: 2, pool: true, signature: 'Deep garden verandah and lap pool', image: sceneIds[7] },
  { id: 'novara-royal-crest-villa', name: 'NOVARA Royal Crest Villa', price: 20000000, size: '4,500 sq.ft. built-up', style: 'Modern heritage residence', exterior: '#d6c6ab', roof: '#4d4942', accent: '#987452', glass: '#56777c', interior: '#d6c3a9', furniture: '#6c5144', stories: 2, pool: false, signature: 'Framed entrance, balcony and private garden', image: sceneIds[8] },
  { id: 'novara-palm-residence-villa', name: 'NOVARA Palm Residence Villa', price: 22500000, size: '4,800 sq.ft. built-up', style: 'Coastal courtyard residence', exterior: '#e5d7c0', roof: '#69766d', accent: '#b98d61', glass: '#65848a', interior: '#ded0b8', furniture: '#81907c', stories: 2, pool: true, signature: 'Palm-lined arrival and shaded courtyard', image: sceneIds[9] }
] as const
const homeListings = [
  { id: 'novara-urban-nest', name: 'NOVARA Urban Nest', price: 6500000, size: '1,450 sq.ft. built-up', style: 'Compact urban modern', exterior: '#ddd7cb', roof: '#46504c', accent: '#a67b51', glass: '#57757a', interior: '#d8cbb7', furniture: '#66726b', stories: 2, pool: false, signature: 'Space-smart open living and roof terrace', image: sceneIds[10] },
  { id: 'novara-serenity-home', name: 'NOVARA Serenity Home', price: 8500000, size: '1,850 sq.ft. built-up', style: 'Soft contemporary family home', exterior: '#e4dac7', roof: '#666453', accent: '#9e8058', glass: '#688088', interior: '#e0d4c2', furniture: '#758274', stories: 1, pool: false, signature: 'Quiet garden-facing rooms and deep eaves', image: sceneIds[11] },
  { id: 'novara-modern-haven', name: 'NOVARA Modern Haven', price: 9500000, size: '2,050 sq.ft. built-up', style: 'Urban courtyard home', exterior: '#c8c0b0', roof: '#464a46', accent: '#9b7656', glass: '#52777b', interior: '#d0c0aa', furniture: '#5d6c69', stories: 2, pool: false, signature: 'Private courtyard and screened balcony', image: sceneIds[12] },
  { id: 'novara-family-retreat', name: 'NOVARA Family Retreat', price: 11000000, size: '2,300 sq.ft. built-up', style: 'Garden pavilion home', exterior: '#d9cdb7', roof: '#4e594d', accent: '#b39669', glass: '#63817b', interior: '#d6c9b4', furniture: '#69775f', stories: 2, pool: false, signature: 'Multi-generational layout and wraparound garden', image: sceneIds[13] }
] as const

const roomPresets: RoomSpec[][] = [
  [
    { name: 'Living room', widthFt: 16, depthFt: 14, role: 'living' },
    { name: 'Master bedroom', widthFt: 14, depthFt: 12, role: 'bedroom' },
    { name: 'Bedroom 2', widthFt: 12, depthFt: 11, role: 'bedroom' },
    { name: 'Bedroom 3', widthFt: 12, depthFt: 11, role: 'bedroom' },
    { name: 'Kitchen', widthFt: 10, depthFt: 10, role: 'kitchen' },
    { name: 'Dining room', widthFt: 12, depthFt: 10, role: 'dining' },
    { name: 'Bathroom', widthFt: 8, depthFt: 7, role: 'bathroom' },
    { name: 'Balcony', widthFt: 10, depthFt: 5, role: 'balcony' },
    { name: 'Staircase', widthFt: 4, depthFt: 14, role: 'staircase' },
    { name: 'Utility area', widthFt: 8, depthFt: 6, role: 'utility' }
  ],
  [
    { name: 'Living room', widthFt: 18, depthFt: 15, role: 'living' },
    { name: 'Master bedroom', widthFt: 15, depthFt: 13, role: 'bedroom' },
    { name: 'Bedroom 2', widthFt: 12, depthFt: 12, role: 'bedroom' },
    { name: 'Bedroom 3', widthFt: 13, depthFt: 11, role: 'bedroom' },
    { name: 'Kitchen', widthFt: 12, depthFt: 10, role: 'kitchen' },
    { name: 'Dining room', widthFt: 14, depthFt: 11, role: 'dining' },
    { name: 'Bathroom', widthFt: 8, depthFt: 8, role: 'bathroom' },
    { name: 'Balcony', widthFt: 12, depthFt: 6, role: 'balcony' },
    { name: 'Staircase', widthFt: 5, depthFt: 15, role: 'staircase' },
    { name: 'Utility area', widthFt: 9, depthFt: 7, role: 'utility' }
  ]
]

function makePlots(area: number, price: number, frontage: number, depth: number): Plot[] {
  const statuses: Plot['status'][] = [
    ...Array.from({ length: 35 }, () => 'Available' as const),
    ...Array.from({ length: 10 }, () => 'Reserved' as const),
    ...Array.from({ length: 15 }, () => 'Sold' as const)
  ]
  return Array.from({ length: 60 }, (_, index) => {
    const row = Math.floor(index / 10)
    const column = index % 10
    const number = `P-${String(index + 1).padStart(3, '0')}`
    const neighbor = (otherRow: number, otherColumn: number) => `P-${String(otherRow * 10 + otherColumn + 1).padStart(3, '0')}`
    const road = (width: number) => ({ neighbor: `${width} ft road`, lengthFt: frontage })
    const lot = (plotNumber: string, lengthFt: number) => ({ neighbor: plotNumber, lengthFt })
    const boundaryDepth = { north: depth, south: depth }
    const corner = row === 0 && column === 0 ? 'North-West corner'
      : row === 0 && column === 9 ? 'North-East corner'
      : row === 5 && column === 0 ? 'South-West corner'
      : row === 5 && column === 9 ? 'South-East corner' : ''
    const boundaries = {
      north: row === 3 ? road(40) : row === 0 ? { neighbor: 'Landscape buffer', lengthFt: frontage } : lot(neighbor(row - 1, column), frontage),
      south: row === 2 ? road(40) : row === 5 ? { neighbor: 'Landscape buffer', lengthFt: frontage } : lot(neighbor(row + 1, column), frontage),
      west: column === 5 ? road(30) : column === 0 ? road(30) : lot(neighbor(row, column - 1), depth),
      east: column === 4 ? road(30) : column === 9 ? road(30) : lot(neighbor(row, column + 1), depth)
    }
    const roadBoundary = Object.entries(boundaries).find(([, boundary]) => boundary.neighbor.includes('road'))
    const facing = roadBoundary ? `${roadBoundary[0][0].toUpperCase()}${roadBoundary[0].slice(1)}-facing` : `${['North', 'East', 'South', 'West'][index % 4]}-facing`
    const cents = area / 435.6
    return {
      number: `P-${String(index + 1).padStart(3, '0')}`,
      size: `${area.toLocaleString('en-IN')} sq.ft.`,
      areaSqFt: area,
      dimensions: `${frontage} × ${depth} ft`,
      frontageFt: frontage,
      depthFt: depth,
      price,
      pricePerSqFt: Math.round(price / area),
      status: statuses[index],
      facing,
      roadFacingSide: roadBoundary ? `${roadBoundary[0][0].toUpperCase()}${roadBoundary[0].slice(1)}` : null,
      roadWidth: boundaries.north.neighbor.includes('road') || boundaries.south.neighbor.includes('road') ? '40 ft' : '30 ft',
      cents,
      corner: !!corner,
      cornerDirection: corner || null,
      boundaries
    }
  })
}

function makeNearby(index: number): NearbyPlace[] {
  const offsets = index * 0.17
  return [
    { type: 'School', name: 'Orchard Grove Demo School', distanceKm: Number((1.2 + offsets).toFixed(1)) },
    { type: 'College', name: 'Northstar Demo College', distanceKm: Number((3.5 + offsets).toFixed(1)) },
    { type: 'Hospital', name: 'Meadowview Demo Hospital', distanceKm: Number((2.0 + offsets).toFixed(1)) },
    { type: 'Bus stop', name: 'Greenway Demo Bus Stop', distanceKm: Number((0.5 + offsets).toFixed(1)) },
    { type: 'Railway station', name: 'Coimbatore Demo Rail Hub', distanceKm: Number((7.0 + offsets).toFixed(1)) },
    { type: 'Airport', name: 'Coimbatore Demo Airport', distanceKm: Number((12.0 + offsets).toFixed(1)) },
    { type: 'Shopping', name: 'Garden Square Demo Market', distanceKm: Number((2.8 + offsets).toFixed(1)) },
    { type: 'Main road', name: `${roads[index % roads.length]} (demo)`, distanceKm: Number((0.7 + offsets).toFixed(1)) }
  ]
}

function makeDesign(index: number, listing?: typeof villaListings[number] | typeof homeListings[number]): DesignProfile {
  if (listing) {
    return {
      style: listing.style, exterior: listing.exterior, roof: listing.roof, accent: listing.accent, glass: listing.glass,
      interior: listing.interior, furniture: listing.furniture, stories: listing.stories, pool: listing.pool, signature: listing.signature
    }
  }
  return {
    style: ['Garden neighbourhood', 'Formal landscaped community', 'Woodland-edge layout', 'Sunrise garden enclave', 'Open-meadow community'][index],
    exterior: '#d8cfbd', roof: '#535a4e', accent: '#a78b63', glass: '#59797c', interior: '#d8cbb5', furniture: '#617067', stories: 1, pool: false,
    signature: 'Illustrative plotted-site plan'
  }
}

function makePlotPlan(plots: Plot[]): PlotPlan {
  const plotAreaAcres = plots.reduce((sum, plot) => sum + plot.areaSqFt / 43560, 0)
  const rawTotalLandAcres = plotAreaAcres / 0.62
  const roadAreaAcres = Number((rawTotalLandAcres * 0.23).toFixed(2))
  const openSpaceAcres = Number((rawTotalLandAcres * 0.10).toFixed(2))
  const amenitiesAreaAcres = Number((rawTotalLandAcres * 0.05).toFixed(2))
  return {
    totalLandAcres: Number((Number(plotAreaAcres.toFixed(2)) + roadAreaAcres + openSpaceAcres + amenitiesAreaAcres).toFixed(2)),
    plotAreaAcres: Number(plotAreaAcres.toFixed(2)),
    roadAreaAcres,
    openSpaceAcres,
    amenitiesAreaAcres
  }
}

function makeProperty(
  input: { id: string; name: string; category: Property['category']; price: number; size: string; style: string; description: string; image: string; index: number; listing?: typeof villaListings[number] | typeof homeListings[number]; plot?: typeof plotListings[number] }
): Property {
  const location = addresses[input.index]
  const plots = input.plot ? makePlots(input.plot.area, input.price, input.plot.frontage, input.plot.depth) : undefined
  const plotPlan = plots ? makePlotPlan(plots) : undefined
  const rooms = input.category === 'Plot' ? undefined : roomPresets[input.index % roomPresets.length]
  return {
    id: input.id, name: input.name, category: input.category,
    location: `${location}, Coimbatore`,
    address: `${input.name}, ${roads[input.index % roads.length]}, ${location}, Coimbatore, Tamil Nadu — fictional demonstration address`,
    size: input.size, landArea: plotPlan ? `${plotPlan.totalLandAcres.toFixed(2)} acres (${(plotPlan.totalLandAcres * 0.404686).toFixed(2)} ha) · sample development land` : undefined,
    price: input.price, description: input.description, status: input.category === 'Plot' ? 'Open for enquiries · demo inventory' : 'Concept residence · demonstration only',
    image: photo(input.image, 1800),
    gallery: [input.image, sceneIds[(input.index + 1) % sceneIds.length], sceneIds[(input.index + 4) % sceneIds.length], sceneIds[(input.index + 8) % sceneIds.length]].map(image => photo(image)),
    video: `/media/properties/${input.id}.mp4`,
    amenities: input.category === 'Plot'
      ? ['Illustrative internal roads', 'Sample green space', 'Proposed gated entry', 'Water and power concepts']
      : ['Furnished concept interior', 'Garden landscaping concept', 'Natural light', 'Parking concept', ...(input.listing?.pool ? ['Swimming pool concept'] : [])],
    features: [input.style, input.category === 'Plot' ? 'Interactive 60-plot sample plan' : `${input.listing?.stories ?? 1}-storey architectural demo model`, 'All details are fictional demonstration data'],
    landmarks: ['Orchard Grove Demo School', 'Meadowview Demo Hospital', 'Greenway Demo Bus Stop', 'Coimbatore Demo Rail Hub'],
    nearby: makeNearby(input.index),
    connectivity: 'Fictional Coimbatore setting. Routes, addresses, landmarks, and distances are illustrative demo data; no real-world locations have been verified.',
    plots, plotPlan, rooms,
    design: makeDesign(input.index, input.listing),
    units: plots?.length ?? 1, phone: '+91 00000 00000', email: 'enquiries@novara.example'
  }
}

export const properties: Property[] = [
  ...plotListings.map((plot, index) => makeProperty({
    id: plot.id, name: plot.name, category: 'Plot', price: plot.price, size: `${plot.area.toLocaleString('en-IN')} sq.ft. plot`,
    style: plot.style,
    description: `${plot.style} with an individually selectable sample ${plot.area.toLocaleString('en-IN')} sq.ft. residential plot. All land, availability, direction, boundary, price and approval details are illustrative only.`,
    image: sceneIds[index], index, plot
  })),
  ...villaListings.map((villa, index) => makeProperty({
    id: villa.id, name: villa.name, category: 'Villa', price: villa.price, size: villa.size,
    style: villa.style, description: `${villa.signature}. This ${villa.style.toLowerCase()} is an individually styled procedural 3D concept for demonstration, not a completed or surveyed home.`,
    image: villa.image, index: index + 5, listing: villa
  })),
  ...homeListings.map((home, index) => makeProperty({
    id: home.id, name: home.name, category: 'Home', price: home.price, size: home.size,
    style: home.style, description: `${home.signature}. This ${home.style.toLowerCase()} is an individually styled procedural 3D concept for demonstration, not a completed or surveyed home.`,
    image: home.image, index: index + 10, listing: home
  }))
]

export type UpcomingProject = { id: string; name: string; type: string; location: string; area: string; description: string; status: string; image: string; features: string[] }
export const upcomingProjects: UpcomingProject[] = [
  { id: 'novara-green-city', name: 'NOVARA Green City', type: 'Plotted community', location: 'Coimbatore, Tamil Nadu', area: '5 hectares', description: 'A proposed green-minded residential community with thoughtfully planned streets, open spaces and room for a connected neighbourhood.', status: 'Proposed · Register interest', image: photo('photo-1449158743715-0a90ebb6d2d8'), features: ['Planned green corridors', 'Community gathering spaces', 'Pedestrian-friendly layout', 'Proposed utility infrastructure'] },
  { id: 'novara-sky-gardens', name: 'NOVARA Sky Gardens', type: 'Luxury villa community', location: 'Coimbatore, Tamil Nadu', area: 'Proposed villa enclave', description: 'An upcoming villa community concept that brings private outdoor living together with contemporary architecture and shared green spaces.', status: 'Coming soon', image: photo('photo-1600607687939-ce8a6c25118c'), features: ['Contemporary villa concepts', 'Private gardens', 'Clubhouse concept', 'Landscaped arrival court'] },
  { id: 'novara-urban-heights', name: 'NOVARA Urban Heights', type: 'Modern residential development', location: 'Coimbatore, Tamil Nadu', area: 'Proposed residential site', description: 'A proposed urban residential address focused on functional planning, everyday convenience and modern shared amenities.', status: 'Early planning', image: photo('photo-1486406146926-c627a92ad1ab'), features: ['Modern residential design', 'Shared lifestyle spaces', 'Convenient city access', 'Sustainable design intent'] }
]

export const formatPrice = (amount: number) => amount >= 10000000
  ? `₹${(amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 2).replace(/\.?0+$/, '')} Cr`
  : `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1).replace(/\.0$/, '')} Lakh`
