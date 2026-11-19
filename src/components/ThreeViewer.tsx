import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Line, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'
import { BoxGeometry as ThreeBoxGeometry, Vector3 } from 'three'
import type { DesignProfile, NearbyPlace, Plot, Property, RoomSpec } from '../data/properties'
import { formatPrice } from '../data/properties'

type Props = {
  category: Property['category']
  property?: Property
  plots?: Plot[]
  selectedPlot: Plot | null
  onSelectPlot: (plot: Plot) => void
}

type TourView = string
const defaultDesign: DesignProfile = { style: 'NOVARA concept home', exterior: '#ded4c2', roof: '#49534b', accent: '#a77d50', glass: '#557881', interior: '#d3bd9e', furniture: '#68756a', stories: 1, pool: false, signature: 'Illustrative architectural concept' }

function PlotScene({ plots, selectedPlot, onSelectPlot, propertyName }: Pick<Props, 'plots' | 'selectedPlot' | 'onSelectPlot'> & { propertyName: string }) {
  const lotPositions = useMemo(() => Array.from({ length: 60 }, (_, index) => {
    const column = index % 10
    const row = Math.floor(index / 10)
    return {
      x: column < 5 ? -4.55 + column * 0.84 : 0.55 + (column - 5) * 0.84,
      z: row < 3 ? -2.72 + row * 0.88 : 0.68 + (row - 3) * 0.88
    }
  }), [])

  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow><planeGeometry args={[13, 10]}/><meshStandardMaterial color="#9fae83" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}><planeGeometry args={[11.3, 8.1]}/><meshStandardMaterial color="#bdc19a" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.075, 0]}><planeGeometry args={[0.72, 7.75]}/><meshStandardMaterial color="#454944" roughness={0.94}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.068, 0]}><planeGeometry args={[0.035, 7.2]}/><meshStandardMaterial color="#e4dfc8"/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.07, 0]}><planeGeometry args={[10.9, 0.58]}/><meshStandardMaterial color="#454944" roughness={0.94}/></mesh>
    {[-4.8, 4.8].map(x => <mesh key={`edge-road-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.08, 0]}><planeGeometry args={[0.28, 7.2]}/><meshStandardMaterial color="#676a61" roughness={0.96}/></mesh>)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.072, 4.45]}><planeGeometry args={[12.2, 0.82]}/><meshStandardMaterial color="#454944" roughness={0.94}/></mesh>
    {Array.from({ length: 12 }, (_, index) => <mesh key={`lane-${index}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, -3.1 + index * 0.56]}><planeGeometry args={[0.035, 0.24]}/><meshStandardMaterial color="#e7e2cf"/></mesh>)}
    {[-4.2, 4.2].map(x => <mesh key={`cross-lane-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.06, 0]}><planeGeometry args={[0.24, 0.035]}/><meshStandardMaterial color="#e7e2cf"/></mesh>)}
    {[-3.9, 3.9].map(x => <mesh key={`green-verge-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.035, 0]}><planeGeometry args={[0.55, 7.3]}/><meshStandardMaterial color="#718c61" roughness={1}/></mesh>)}
    {[-3.28, 3.28].map(z => <mesh key={`green-cross-verge-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, z]}><planeGeometry args={[10.5, 0.24]}/><meshStandardMaterial color="#718c61" roughness={1}/></mesh>)}
    {[-5.42, 5.42].map(x => <group key={`side-fence-${x}`}>
      <mesh position={[x, 0.24, 0]}><boxGeometry args={[0.1, 0.42, 7.05]}/><meshStandardMaterial color="#c9c4ae" roughness={0.9}/></mesh>
      {Array.from({ length: 10 }, (_, index) => <mesh key={index} position={[x, 0.31, -3.4 + index * 0.75]}><boxGeometry args={[0.17, 0.62, 0.17]}/><meshStandardMaterial color="#d8d1bc" roughness={0.9}/></mesh>)}
    </group>)}
    <mesh position={[0, 0.24, -3.55]}><boxGeometry args={[10.9, 0.42, 0.1]}/><meshStandardMaterial color="#c9c4ae" roughness={0.9}/></mesh>
    <mesh position={[-3.2, 0.24, 3.55]}><boxGeometry args={[4.45, 0.42, 0.1]}/><meshStandardMaterial color="#c9c4ae" roughness={0.9}/></mesh>
    <mesh position={[3.2, 0.24, 3.55]}><boxGeometry args={[4.45, 0.42, 0.1]}/><meshStandardMaterial color="#c9c4ae" roughness={0.9}/></mesh>
    {Array.from({ length: 12 }, (_, index) => {
      const x = -5.3 + index * 0.96
      return <mesh key={`rear-post-${index}`} position={[x, 0.31, -3.55]}><boxGeometry args={[0.17, 0.62, 0.17]}/><meshStandardMaterial color="#d8d1bc" roughness={0.9}/></mesh>
    })}
    {lotPositions.map((position, index) => {
      const plot = plots?.[index]
      const selected = plot?.number === selectedPlot?.number
      const color = selected ? '#d9b873' : plot?.status === 'Sold' ? '#898980' : plot?.status === 'Reserved' ? '#c99350' : '#82966c'
      return <group key={plot?.number ?? index} position={[position.x, 0, position.z]} onClick={event => {
        event.stopPropagation()
        if (plot) onSelectPlot(plot)
      }}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.68, 0.055, 0.68]}/><meshStandardMaterial color={color} roughness={0.83}/></mesh>
        <lineSegments position={[0, 0.04, 0]}><edgesGeometry args={[new ThreeBoxGeometry(0.7, 0.07, 0.7)]}/><lineBasicMaterial color={selected ? '#fff3ce' : '#ece9db'}/></lineSegments>
        {index % 5 === 1 && <Tree position={[-0.2, 0.04, -0.2]}/>}
      </group>
    })}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.35, -0.025, 2.55]}><planeGeometry args={[1.15, 0.92]}/><meshStandardMaterial color="#62845c"/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.4, -0.025, -2.45]}><planeGeometry args={[1.1, 0.9]}/><meshStandardMaterial color="#7d9263"/></mesh>
    {[[-3.65, 0, 2.45], [-3.1, 0, 2.5], [3.1, 0, -2.5], [3.65, 0, -2.4], [-4.3, 0, -3.5], [4.3, 0, 3.35]].map(([x, y, z], index) => <Tree key={index} position={[x, y, z]}/>)}
    {[-2.8, -1.85, 1.85, 2.8].map(z => <group key={z} position={[0.48, 0, z]}>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.025, 0.04, 1.4, 6]}/><meshStandardMaterial color="#66675e" metalness={0.3}/></mesh>
      <mesh position={[0.14, 1.43, 0]}><sphereGeometry args={[0.09, 8, 6]}/><meshStandardMaterial color="#e5d19c" emissive="#d5b66e" emissiveIntensity={0.45}/></mesh>
    </group>)}
    <mesh position={[-0.52, 0.4, 3.75]}><boxGeometry args={[0.16, 0.8, 0.16]}/><meshStandardMaterial color="#a78b63"/></mesh>
    <mesh position={[0.52, 0.4, 3.75]}><boxGeometry args={[0.16, 0.8, 0.16]}/><meshStandardMaterial color="#a78b63"/></mesh>
    <mesh position={[0, 0.82, 3.75]}><boxGeometry args={[1.18, 0.14, 0.2]}/><meshStandardMaterial color="#d1bb8b"/></mesh>
    <Html position={[0, 1.25, 3.75]} center distanceFactor={10} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}><span style={{ color: '#f5e8c5', background: '#313934', borderRadius: 4, padding: '4px 8px', fontSize: 10, letterSpacing: 1 }}>{propertyName.toUpperCase()} · DEMO ENTRY</span></Html>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 5.2]}><planeGeometry args={[13, 0.5]}/><meshStandardMaterial color="#c6b997"/></mesh>
  </group>
}

function NearbyScene({ property, selectedPlace, onSelectPlace }: { property: Property; selectedPlace: NearbyPlace | null; onSelectPlace: (place: NearbyPlace) => void }) {
  const places = property.nearby
  const markers = useMemo(() => {
    const farthest = Math.max(...places.map(place => place.distanceKm), 1)
    return places.map((place, index) => {
      const angle = -Math.PI / 2 + index * Math.PI * 2 / places.length
      const radius = 4.1 + (place.distanceKm / farthest) * 2.4
      return {
        place,
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round((angle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2) / (Math.PI / 4)) % 8]
      }
    })
  }, [places])

  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.22, 0]} receiveShadow><planeGeometry args={[23, 21]}/><meshStandardMaterial color="#a6b690" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}><planeGeometry args={[20, 18]}/><meshStandardMaterial color="#b9c09a" roughness={1}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}><planeGeometry args={[0.78, 17]}/><meshStandardMaterial color="#535750" roughness={0.96}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.075, 0]}><planeGeometry args={[17, 0.78]}/><meshStandardMaterial color="#535750" roughness={0.96}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.069, 0]}><planeGeometry args={[0.035, 16.4]}/><meshStandardMaterial color="#e2dec9"/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.069, 0]}><planeGeometry args={[16.4, 0.035]}/><meshStandardMaterial color="#e2dec9"/></mesh>
    {Array.from({ length: 10 }, (_, index) => {
      const side = index % 4
      const offset = -5.8 + Math.floor(index / 4) * 2.9
      const positions: [number, number, number][] = [[offset, 0, -7.2], [offset, 0, 7.2], [-7.2, 0, offset], [7.2, 0, offset]]
      const [x, y, z] = positions[side]
      return <group key={`neighbourhood-${index}`} position={[x, y, z]} rotation={[0, side > 1 ? Math.PI / 2 : 0, 0]}>
        <mesh position={[0, 0.24, 0]} castShadow><boxGeometry args={[0.75, 0.48 + (index % 3) * 0.12, 0.68]}/><meshStandardMaterial color={['#d7c6a9', '#c8c0af', '#cbb49b'][index % 3]} roughness={0.86}/></mesh>
        <mesh position={[0, 0.52 + (index % 3) * 0.12, 0]}><boxGeometry args={[0.82, 0.08, 0.74]}/><meshStandardMaterial color="#6a7062" roughness={0.8}/></mesh>
      </group>
    })}
    <group position={[0, -0.02, 0]}>
      <mesh position={[0, 0.04, 0]}><boxGeometry args={[2.45, 0.12, 2.7]}/><meshStandardMaterial color="#6e825c"/></mesh>
      <mesh position={[0, 0.13, 0]}><boxGeometry args={[1.38, 0.12, 1.85]}/><meshStandardMaterial color="#b3875f"/></mesh>
      <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[0.92, 0.48, 1.05]}/><meshStandardMaterial color={property.design.exterior}/></mesh>
      <mesh position={[0, 0.67, 0]}><boxGeometry args={[1.02, 0.08, 1.15]}/><meshStandardMaterial color={property.design.roof}/></mesh>
      {[[-0.8, -0.95], [0.8, -0.95], [-0.8, 0.95], [0.8, 0.95]].map(([x, z], index) => <Tree key={index} position={[x, 0.08, z]}/>)}
      <Html position={[0, 1.05, 0]} center distanceFactor={10} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}><span style={{ color: '#f5e8c5', background: '#2c3437', borderRadius: 5, padding: '5px 9px', fontSize: 11, letterSpacing: 0.5 }}>{property.name} · DEMO SITE</span></Html>
    </group>
    {markers.map(({ place, x, z, direction }) => {
      const active = selectedPlace?.type === place.type
      const markerColor = place.type === 'Hospital' ? '#e5e3d6' : place.type === 'School' || place.type === 'College' ? '#d9c39d' : place.type === 'Shopping' ? '#cfb99a' : '#c8d0bb'
      return <group key={place.type} position={[x, 0, z]}>
        <Line points={[[-x, 0.12, -z], [0, 0.12, 0]]} color={active ? '#f0d17e' : '#e3ca83'} lineWidth={1.5} dashed dashSize={0.22} gapSize={0.16} transparent opacity={0.8}/>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]}><circleGeometry args={[0.62, 24]}/><meshBasicMaterial color="#d5bb72" transparent opacity={0.27}/></mesh>
        <group onClick={event => { event.stopPropagation(); onSelectPlace(place) }}>
          <mesh position={[0, 0.32, 0]} castShadow><boxGeometry args={[0.86, 0.62, 0.72]}/><meshStandardMaterial color={markerColor} roughness={0.84}/></mesh>
          <mesh position={[0, 0.67, 0]}><boxGeometry args={[0.94, 0.08, 0.8]}/><meshStandardMaterial color={active ? '#d1a950' : '#78846b'}/></mesh>
          {place.type === 'Hospital' && <group position={[0, 0.38, 0.37]}>
            <mesh><boxGeometry args={[0.38, 0.08, 0.035]}/><meshStandardMaterial color="#a85043"/></mesh>
            <mesh><boxGeometry args={[0.08, 0.32, 0.035]}/><meshStandardMaterial color="#a85043"/></mesh>
          </group>}
          {place.type === 'Bus stop' && <mesh position={[0.65, 0.52, 0]}><cylinderGeometry args={[0.035, 0.035, 1.05, 8]}/><meshStandardMaterial color="#696c63"/></mesh>}
        </group>
        <Html position={[0, 1.05, 0]} center distanceFactor={10} zIndexRange={[20, 0]}>
          <button type="button" onClick={() => onSelectPlace(place)} style={{
            display: 'block', minWidth: 130, maxWidth: 190, border: `1px solid ${active ? '#dfbd67' : '#515a5c'}`,
            borderRadius: 8, padding: '7px 10px', textAlign: 'left', color: '#f2eee2',
            background: '#273036', boxShadow: '0 5px 16px #17201d55', cursor: 'pointer'
          }}>
            <strong style={{ display: 'block', fontSize: 11, lineHeight: 1.35 }}>{place.name}</strong>
            <span style={{ display: 'block', marginTop: 3, color: '#c4ccd0', fontSize: 10 }}>{place.distanceKm.toFixed(1)} km · {direction} · direction approx.</span>
          </button>
        </Html>
      </group>
    })}
    <Html position={[8.4, 1.2, -7.1]} center distanceFactor={10} style={{ pointerEvents: 'none' }}><span style={{ color: '#23302d', background: '#e9e5d7', borderRadius: 99, padding: '5px 9px', fontSize: 11 }}>N ↑</span></Html>
  </group>
}

function Tree({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <mesh position={[0, 0.24, 0]} castShadow><cylinderGeometry args={[0.045, 0.065, 0.48, 7]}/><meshStandardMaterial color="#69513a"/></mesh>
    <mesh position={[0, 0.7, 0]} castShadow><sphereGeometry args={[0.28, 8, 7]}/><meshStandardMaterial color="#607a56" roughness={0.9}/></mesh>
    <mesh position={[-0.14, 0.67, 0.03]} castShadow><sphereGeometry args={[0.19, 7, 6]}/><meshStandardMaterial color="#6d895c" roughness={0.92}/></mesh>
    <mesh position={[0.14, 0.7, -0.02]} castShadow><sphereGeometry args={[0.2, 7, 6]}/><meshStandardMaterial color="#56764f" roughness={0.92}/></mesh>
  </group>
}

function VillaExterior({ design }: { design: DesignProfile }) {
  const roofY = design.stories > 1 ? 3.58 : 2.1
  const pitchedRoof = design.style.includes('Tropical') || design.style.includes('heritage') || design.style.includes('Coastal')
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow><planeGeometry args={[11, 8]}/><meshStandardMaterial color="#788a69"/></mesh>
    <mesh position={[0, 0.08, 0]}><boxGeometry args={[4.7, 0.18, 3.8]}/><meshStandardMaterial color="#cfbfa7"/></mesh>
    <mesh position={[0, 1.17, 0]} castShadow><boxGeometry args={[3.6, 2.05, 2.8]}/><meshStandardMaterial color={design.exterior} roughness={0.83}/></mesh>
    {design.stories > 1 && <mesh position={[0, 2.85, -0.28]} castShadow><boxGeometry args={[3.2, 1.35, 2.35]}/><meshStandardMaterial color={design.exterior} roughness={0.83}/></mesh>}
    {pitchedRoof
      ? <>
        <mesh position={[-0.95, roofY, 0]} rotation={[0, 0, -0.34]} castShadow><boxGeometry args={[1.96, 0.14, 3.4]}/><meshStandardMaterial color={design.roof} roughness={0.7}/></mesh>
        <mesh position={[0.95, roofY, 0]} rotation={[0, 0, 0.34]} castShadow><boxGeometry args={[1.96, 0.14, 3.4]}/><meshStandardMaterial color={design.roof} roughness={0.7}/></mesh>
      </>
      : <mesh position={[0, roofY, -0.02]} castShadow><boxGeometry args={[3.85, 0.18, 3]}/><meshStandardMaterial color={design.roof} roughness={0.7}/></mesh>}
    <mesh position={[0, 1.1, 1.415]}><boxGeometry args={[0.64, 1.6, 0.045]}/><meshStandardMaterial color={design.accent}/></mesh>
    {[-1.12, 1.12].map(x => <mesh key={x} position={[x, 1.36, 1.42]}><boxGeometry args={[0.74, 0.72, 0.05]}/><meshStandardMaterial color={design.glass} metalness={0.18} roughness={0.25}/></mesh>)}
    {design.stories > 1 && [-1, 1].map(x => <mesh key={x} position={[x, 2.85, 0.91]}><boxGeometry args={[0.9, 0.58, 0.05]}/><meshStandardMaterial color={design.glass} metalness={0.18} roughness={0.25}/></mesh>)}
    {[-0.95, 0.95].map(x => <mesh key={`rear-${x}`} position={[x, 1.26, -1.42]}><boxGeometry args={[0.78, 0.72, 0.05]}/><meshStandardMaterial color={design.glass} metalness={0.18} roughness={0.25}/></mesh>)}
    <mesh position={[1.84, 1.25, -0.3]}><boxGeometry args={[0.05, 0.78, 0.95]}/><meshStandardMaterial color={design.glass} metalness={0.18} roughness={0.25}/></mesh>
    <mesh position={[1.4, 2.12, 0.4]}><boxGeometry args={[1.05, 0.12, 1.5]}/><meshStandardMaterial color="#af9d81"/></mesh>
    <mesh position={[1.4, 1.84, 0.4]}><boxGeometry args={[0.07, 0.55, 0.07]}/><meshStandardMaterial color="#514a3e"/></mesh>
    <mesh position={[0.6, 0.04, 2.5]}><boxGeometry args={[2.8, 0.1, 2.8]}/><meshStandardMaterial color="#b5ac99"/></mesh>
    <mesh position={[0.55, 0.14, 2.25]}><boxGeometry args={[1.25, 0.22, 0.68]}/><meshStandardMaterial color="#50554c"/></mesh>
    <mesh position={[0.55, 0.42, 2.25]}><boxGeometry args={[1.25, 0.36, 0.68]}/><meshStandardMaterial color="#57645a"/></mesh>
    {design.pool && <><mesh position={[-2.2, -0.005, -1.7]}><boxGeometry args={[2.3, 0.08, 1.45]}/><meshStandardMaterial color="#4d8588" metalness={0.18} roughness={0.2}/></mesh><mesh position={[-2.2, 0.03, -1.7]}><boxGeometry args={[2.5, 0.035, 1.65]}/><meshStandardMaterial color={design.accent}/></mesh></>}
    <Tree position={[-3, 0, 1.5]}/><Tree position={[3, 0, 1.1]}/><Tree position={[-3.4, 0, -1.6]}/>
  </group>
}

function RoomScene({ room, design }: { room: RoomSpec; design: DesignProfile }) {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow><planeGeometry args={[8, 7]}/><meshStandardMaterial color={design.interior} roughness={0.92}/></mesh>
    <mesh position={[0, 1.65, -3.2]}><boxGeometry args={[8, 3.4, 0.15]}/><meshStandardMaterial color={design.exterior} roughness={0.9}/></mesh>
    <mesh position={[-3.9, 1.65, 0]}><boxGeometry args={[0.15, 3.4, 6.5]}/><meshStandardMaterial color={design.exterior} roughness={0.9}/></mesh>
    <mesh position={[3.9, 1.65, 0]}><boxGeometry args={[0.15, 3.4, 6.5]}/><meshStandardMaterial color={design.exterior} roughness={0.9}/></mesh>
    {[-1.5, 1.5].map(x => <mesh key={x} position={[x, 2.3, -3.1]}><boxGeometry args={[1.1, 0.95, 0.03]}/><meshStandardMaterial color={design.glass} roughness={0.3}/></mesh>)}
    {room.role === 'kitchen' ? <>
        <mesh position={[0, 0.48, -2.35]}><boxGeometry args={[5.6, 0.88, 1.1]}/><meshStandardMaterial color={design.furniture}/></mesh>
        <mesh position={[0, 0.98, -2.35]}><boxGeometry args={[5.75, 0.12, 1.2]}/><meshStandardMaterial color={design.interior}/></mesh>
        <mesh position={[0, 0.55, 0.45]}><boxGeometry args={[2.5, 0.9, 1.2]}/><meshStandardMaterial color={design.accent}/></mesh>
      <mesh position={[0, 1.04, 0.45]}><boxGeometry args={[2.65, 0.12, 1.35]}/><meshStandardMaterial color="#e8e2d5"/></mesh>
      {[-1.6, 1.6].map(x => <mesh key={x} position={[x, 0.52, 1.25]}><boxGeometry args={[0.08, 0.9, 0.08]}/><meshStandardMaterial color="#51473b"/></mesh>)}
    </> : room.role === 'bedroom' ? <>
      <mesh position={[0, 0.33, -0.7]}><boxGeometry args={[2.5, 0.46, 2.6]}/><meshStandardMaterial color="#795f49"/></mesh>
      <mesh position={[0, 0.62, -0.7]}><boxGeometry args={[2.4, 0.22, 2.4]}/><meshStandardMaterial color={design.interior}/></mesh>
      <mesh position={[0, 0.9, -1.65]}><boxGeometry args={[2.5, 0.58, 0.16]}/><meshStandardMaterial color={design.accent}/></mesh>
      {[-2.2, 2.2].map(x => <mesh key={x} position={[x, 0.3, -0.8]}><boxGeometry args={[0.58, 0.58, 0.58]}/><meshStandardMaterial color={design.furniture}/></mesh>)}
    </> : room.role === 'dining' ? <>
      <mesh position={[0, 0.72, -0.1]}><boxGeometry args={[2.7, 0.12, 1.5]}/><meshStandardMaterial color="#886b4c"/></mesh>
      {[[-1.3, -0.9], [1.3, -0.9], [-1.3, 0.9], [1.3, 0.9]].map(([x, z]) => <mesh key={`${x}-${z}`} position={[x, 0.32, z]}><boxGeometry args={[0.45, 0.62, 0.45]}/><meshStandardMaterial color="#657264"/></mesh>)}
    </> : room.role === 'bathroom' ? <>
      <mesh position={[1.75, 0.2, -1.9]}><boxGeometry args={[3.6, 0.35, 1.4]}/><meshStandardMaterial color="#e8e5de"/></mesh>
      <mesh position={[-1.7, 0.55, -1.7]}><boxGeometry args={[1.25, 1.05, 0.75]}/><meshStandardMaterial color="#e7e2d6"/></mesh>
      <mesh position={[-1.7, 1.12, -1.65]}><cylinderGeometry args={[0.08, 0.08, 0.25, 12]}/><meshStandardMaterial color="#aaa998" metalness={0.55}/></mesh>
    </> : room.role === 'balcony' ? <>
      <mesh position={[0, 0.05, 0.65]}><boxGeometry args={[5.9, 0.12, 3.6]}/><meshStandardMaterial color={design.accent}/></mesh>
      <mesh position={[0, 0.65, 1.95]}><boxGeometry args={[5.9, 1.2, 0.07]}/><meshStandardMaterial color={design.glass} transparent opacity={0.7}/></mesh>
      {[-2.2, -1.1, 0, 1.1, 2.2].map(x => <mesh key={x} position={[x, 0.95, 1.95]}><cylinderGeometry args={[0.025, 0.025, 1.1, 6]}/><meshStandardMaterial color={design.accent}/></mesh>)}
    </> : room.role === 'staircase' ? <>
      {Array.from({ length: 10 }, (_, index) => <mesh key={index} position={[-2.05 + index * 0.44, 0.08 + index * 0.145, 0]}><boxGeometry args={[0.46, 0.18, 2.2]}/><meshStandardMaterial color={design.accent}/></mesh>)}
      <mesh position={[0, 1.07, 0]}><boxGeometry args={[4.5, 0.08, 0.08]}/><meshStandardMaterial color={design.furniture}/></mesh>
    </> : room.role === 'utility' ? <>
      <mesh position={[0, 0.5, -2.35]}><boxGeometry args={[4.7, 0.95, 1.05]}/><meshStandardMaterial color={design.furniture}/></mesh>
      <mesh position={[0, 1.04, -2.35]}><boxGeometry args={[4.9, 0.12, 1.2]}/><meshStandardMaterial color={design.interior}/></mesh>
      <mesh position={[1.5, 0.53, 0.45]}><cylinderGeometry args={[0.42, 0.42, 0.94, 20]}/><meshStandardMaterial color={design.glass} metalness={0.2}/></mesh>
    </> : <>
      <mesh position={[0, 0.48, -0.85]}><boxGeometry args={[3.4, 0.85, 1.1]}/><meshStandardMaterial color={design.furniture}/></mesh>
      <mesh position={[0, 0.82, -0.2]}><boxGeometry args={[3.35, 0.46, 0.25]}/><meshStandardMaterial color={design.interior}/></mesh>
      <mesh position={[0, 0.25, 0.9]}><boxGeometry args={[2.3, 0.12, 1.3]}/><meshStandardMaterial color={design.accent}/></mesh>
      <mesh position={[0, 0.68, 0.9]}><cylinderGeometry args={[0.46, 0.5, 0.09, 24]}/><meshStandardMaterial color="#c9b797"/></mesh>
    </>}
    <mesh position={[0, 3.3, -0.2]}><cylinderGeometry args={[0.1, 0.16, 0.32, 12]}/><meshStandardMaterial color={design.accent} emissive={design.accent} emissiveIntensity={0.25}/></mesh>
    <mesh position={[-3.89, 2.25, 0]}><boxGeometry args={[0.035, 0.85, 1.7]}/><meshStandardMaterial color={design.glass} metalness={0.15} roughness={0.3}/></mesh>
  </group>
}

function DollhouseRoom({ room, design, position }: { room: RoomSpec; design: DesignProfile; position: [number, number, number] }) {
  const wallMaterial = <meshStandardMaterial color={design.exterior} roughness={0.88}/>
  return <group position={position}>
    <mesh position={[0, -0.035, 0]} receiveShadow><boxGeometry args={[2.78, 0.1, 2.58]}/><meshStandardMaterial color={room.role === 'balcony' ? '#bcb6a7' : '#a9825d'} roughness={0.88}/></mesh>
    <mesh position={[0, 0.74, -1.28]} castShadow><boxGeometry args={[2.78, 1.48, 0.1]}/>{wallMaterial}</mesh>
    <mesh position={[-1.38, 0.74, 0]} castShadow><boxGeometry args={[0.1, 1.48, 2.58]}/>{wallMaterial}</mesh>
    {room.role === 'bedroom' ? <>
      <mesh position={[0.22, 0.16, -0.38]} castShadow><boxGeometry args={[1.42, 0.24, 1.48]}/><meshStandardMaterial color={design.furniture}/></mesh>
      <mesh position={[0.22, 0.31, -0.38]}><boxGeometry args={[1.34, 0.1, 1.36]}/><meshStandardMaterial color="#eee8dd"/></mesh>
      <mesh position={[0.22, 0.48, -1.05]}><boxGeometry args={[1.48, 0.52, 0.1]}/><meshStandardMaterial color={design.accent}/></mesh>
      {[-0.2, 0.45].map(x => <mesh key={x} position={[x, 0.4, -0.86]}><boxGeometry args={[0.42, 0.12, 0.28]}/><meshStandardMaterial color="#f7f3eb"/></mesh>)}
      <mesh position={[1.02, 0.38, -0.9]}><boxGeometry args={[0.42, 0.72, 0.62]}/><meshStandardMaterial color={design.accent}/></mesh>
      <mesh position={[1.03, 0.43, 0.94]}><boxGeometry args={[0.5, 0.82, 0.44]}/><meshStandardMaterial color={design.furniture}/></mesh>
    </> : room.role === 'living' ? <>
      <mesh position={[0.18, 0.3, -0.78]} castShadow><boxGeometry args={[1.82, 0.52, 0.62]}/><meshStandardMaterial color={design.furniture}/></mesh>
      <mesh position={[0.18, 0.59, -1.02]}><boxGeometry args={[1.82, 0.42, 0.14]}/><meshStandardMaterial color={design.furniture}/></mesh>
      {[-0.63, 0.18, 0.99].map(x => <mesh key={`cushion-${x}`} position={[x, 0.57, -0.78]}><boxGeometry args={[0.68, 0.12, 0.48]}/><meshStandardMaterial color={design.interior}/></mesh>)}
      {[-0.45, 0.18, 0.81].map(x => <mesh key={x} position={[x, 0.29, -0.45]}><boxGeometry args={[0.08, 0.28, 0.08]}/><meshStandardMaterial color={design.accent}/></mesh>)}
      <mesh position={[0.16, 0.24, 0.18]}><boxGeometry args={[1.12, 0.12, 0.58]}/><meshStandardMaterial color={design.accent}/></mesh>
      <mesh position={[1.05, 0.56, 0.36]}><boxGeometry args={[0.13, 0.92, 0.72]}/><meshStandardMaterial color="#4c514d" roughness={0.35}/></mesh>
    </> : room.role === 'kitchen' ? <>
      <mesh position={[0.1, 0.37, -0.92]}><boxGeometry args={[2.22, 0.68, 0.54]}/><meshStandardMaterial color={design.furniture}/></mesh>
      <mesh position={[0.1, 0.75, -0.92]}><boxGeometry args={[2.3, 0.1, 0.6]}/><meshStandardMaterial color="#e9e2d5"/></mesh>
      <mesh position={[0.34, 0.38, 0.16]}><boxGeometry args={[1.18, 0.7, 0.58]}/><meshStandardMaterial color={design.accent}/></mesh>
      <mesh position={[0.34, 0.76, 0.16]}><boxGeometry args={[1.28, 0.1, 0.66]}/><meshStandardMaterial color="#eee8de"/></mesh>
      <mesh position={[0.1, 0.82, -0.92]}><boxGeometry args={[0.42, 0.035, 0.26]}/><meshStandardMaterial color="#798885" metalness={0.45}/></mesh>
    </> : room.role === 'dining' ? <>
      <mesh position={[0.08, 0.48, -0.02]} castShadow><boxGeometry args={[1.38, 0.12, 0.86]}/><meshStandardMaterial color={design.accent}/></mesh>
      {[-0.58, 0.72].map(x => [-0.48, 0.45].map(z => <mesh key={`${x}-${z}`} position={[x, 0.23, z]}><boxGeometry args={[0.28, 0.42, 0.28]}/><meshStandardMaterial color={design.furniture}/></mesh>))}
    </> : room.role === 'bathroom' ? <>
      <mesh position={[0.69, 0.2, -0.76]}><boxGeometry args={[0.9, 0.32, 0.72]}/><meshStandardMaterial color="#f2f0e9"/></mesh>
      <mesh position={[-0.69, 0.2, -0.84]}><cylinderGeometry args={[0.28, 0.28, 0.4, 16]}/><meshStandardMaterial color="#f2f0e9"/></mesh>
      <mesh position={[0.89, 0.45, 0.38]}><boxGeometry args={[0.66, 0.58, 0.38]}/><meshStandardMaterial color="#ded8ca" metalness={0.08}/></mesh>
      <mesh position={[0.89, 0.77, 0.38]}><boxGeometry args={[0.72, 0.08, 0.42]}/><meshStandardMaterial color="#f7f3eb"/></mesh>
    </> : room.role === 'staircase' ? <>
      {Array.from({ length: 7 }, (_, index) => <mesh key={index} position={[-0.9 + index * 0.28, 0.11 + index * 0.13, 0.4 - index * 0.17]}><boxGeometry args={[0.38, 0.1, 0.82]}/><meshStandardMaterial color={design.accent}/></mesh>)}
      <mesh position={[0.98, 0.57, -0.31]}><boxGeometry args={[0.48, 1.14, 0.72]}/><meshStandardMaterial color={design.interior}/></mesh>
    </> : room.role === 'utility' ? <>
      <mesh position={[0.06, 0.39, -0.91]}><boxGeometry args={[2.14, 0.7, 0.55]}/><meshStandardMaterial color={design.furniture}/></mesh>
      <mesh position={[0.06, 0.78, -0.91]}><boxGeometry args={[2.2, 0.09, 0.62]}/><meshStandardMaterial color="#e8e2d7"/></mesh>
      <mesh position={[0.65, 0.32, 0.35]}><cylinderGeometry args={[0.25, 0.25, 0.56, 18]}/><meshStandardMaterial color="#bac1bf" metalness={0.2}/></mesh>
      <mesh position={[0.65, 0.32, 0.35]}><cylinderGeometry args={[0.15, 0.15, 0.57, 18]}/><meshStandardMaterial color="#778a8b" metalness={0.15}/></mesh>
    </> : <>
      <mesh position={[0, 0.05, 1.08]}><boxGeometry args={[2.6, 0.1, 0.24]}/><meshStandardMaterial color={design.accent}/></mesh>
      {[-1.1, 0, 1.1].map(x => <mesh key={x} position={[x, 0.52, 1.12]}><boxGeometry args={[0.07, 0.92, 0.07]}/><meshStandardMaterial color={design.accent}/></mesh>)}
      <mesh position={[0, 0.92, 1.12]}><boxGeometry args={[2.3, 0.07, 0.07]}/><meshStandardMaterial color={design.accent}/></mesh>
    </>}
    <mesh position={[0.66, 1.18, -1.215]}><boxGeometry args={[0.68, 0.58, 0.025]}/><meshStandardMaterial color={design.glass} metalness={0.12} roughness={0.24}/></mesh>
  </group>
}

function DollhouseScene({ rooms, design, floor }: { rooms: RoomSpec[]; design: DesignProfile; floor: 'all' | 'ground' | 'upper' }) {
  const groundRoles: RoomSpec['role'][] = ['living', 'dining', 'kitchen', 'utility', 'staircase', 'bathroom']
  const groundRooms = design.stories > 1 ? rooms.filter(room => groundRoles.includes(room.role)) : rooms
  const upperRooms = design.stories > 1 ? rooms.filter(room => !groundRoles.includes(room.role)) : []
  const floors = [
    { name: 'ground', rooms: groundRooms, y: 0.1 },
    { name: 'upper', rooms: upperRooms, y: 3.15 }
  ].filter(item => item.rooms.length && (floor === 'all' || item.name === floor))
  return <group>
    {floors.map(level => <group key={level.name} position={[0, 0, floor === 'all' && level.name === 'upper' ? -2.15 : 0]}>
      {(() => {
        const columns = level.rooms.length <= 4 ? 2 : 3
        const rows = Math.ceil(level.rooms.length / columns)
        const width = columns * 2.86 + 0.14
        const depth = rows * 2.68 + 0.2
        return <>
          <mesh position={[0, level.y - 0.16, 0]} receiveShadow><boxGeometry args={[width, 0.2, depth]}/><meshStandardMaterial color={design.exterior} roughness={0.82}/></mesh>
          {level.rooms.map((room, index) => <DollhouseRoom
            key={`${level.name}-${room.name}`}
            room={room}
            design={design}
            position={[(index % columns - (columns - 1) / 2) * 2.86, level.y, (Math.floor(index / columns) - (rows - 1) / 2) * 2.68]}
          />)}
          <mesh position={[0, level.y - 0.045, 0]}><boxGeometry args={[width + 0.1, 0.1, depth + 0.1]}/><meshStandardMaterial color={design.accent} roughness={0.75}/></mesh>
          <mesh position={[0, level.y - 0.01, 0]}><boxGeometry args={[width, 0.04, depth]}/><meshStandardMaterial color="#a9825d" roughness={0.82}/></mesh>
        </>
      })()}
    </group>)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]} receiveShadow><planeGeometry args={[12, 9]}/><meshStandardMaterial color="#aab49b" roughness={1}/></mesh>
    <Tree position={[-5.15, -0.25, 2.7]}/><Tree position={[5.1, -0.25, 2.8]}/><Tree position={[-5.1, -0.25, -2.7]}/>
  </group>
}

function CameraPreset({ view }: { view: TourView }) {
  const target = useMemo(() => new Vector3(0, view === 'Dollhouse' ? 1.75 : view === 'Upper floor' ? 3.2 : view === 'Ground floor' ? 0.8 : view === 'Site' || view.startsWith('Nearby') ? 0 : 1, 0), [view])
  return <CameraPlacement view={view} target={target}/>
}

function CameraPlacement({ view, target }: { view: TourView; target: Vector3 }) {
  const { camera } = useThree()
  useEffect(() => {
    if (view.startsWith('Nearby')) camera.position.set(0, 22, 8)
    else if (view === 'Site') camera.position.set(10, 11.5, 12)
    else if (view === 'Dollhouse') camera.position.set(11, 12.5, 13)
    else if (view === 'Ground floor') camera.position.set(9.5, 8.5, 10)
    else if (view === 'Upper floor') camera.position.set(9.5, 8.5, 10)
    else if (view === 'Aerial site view') camera.position.set(8.5, 10.5, 11)
    else if (view === 'Ground view') camera.position.set(7.5, 3.3, 8)
    else if (view === 'Front elevation') camera.position.set(7.2, 5.2, 8)
    else if (view === 'Rear elevation') camera.position.set(-7.2, 5.2, -8)
    else if (view === 'Side elevation') camera.position.set(9.5, 4.2, 0.4)
    else if (view === 'Garden') camera.position.set(0.5, 5.5, 10)
    else camera.position.set(5.2, 3.5, 7.5)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  }, [camera, target, view])
  return null
}

export default function ThreeViewer({ category, property, plots, selectedPlot, onSelectPlot }: Props) {
  const isPlot = category === 'Plot'
  const design = property?.design ?? defaultDesign
  const [selectedNearby, setSelectedNearby] = useState<NearbyPlace | null>(null)
  const rooms = property?.rooms ?? [
    { name: 'Living room', widthFt: 16, depthFt: 14, role: 'living' as const },
    { name: 'Kitchen', widthFt: 10, depthFt: 10, role: 'kitchen' as const },
    { name: 'Master bedroom', widthFt: 14, depthFt: 12, role: 'bedroom' as const },
    { name: 'Bedroom 2', widthFt: 12, depthFt: 11, role: 'bedroom' as const },
    { name: 'Bathroom', widthFt: 8, depthFt: 7, role: 'bathroom' as const },
    { name: 'Dining room', widthFt: 12, depthFt: 10, role: 'dining' as const },
    { name: 'Balcony', widthFt: 10, depthFt: 5, role: 'balcony' as const }
  ]
  const initialView = isPlot ? 'Site' : 'Dollhouse'
  const [view, setView] = useState<TourView>(initialView)
  const views: TourView[] = isPlot
    ? [initialView, `Nearby · ${property?.nearby.length ?? 0}`]
    : [initialView, 'Ground floor', ...(design.stories > 1 ? ['Upper floor'] : []), 'Front elevation', 'Rear elevation', 'Side elevation', 'Garden', ...rooms.map(room => room.name)]
  const activeRoom = rooms.find(room => room.name === view) ?? rooms[0]
  const floorPlanRooms = [
    { room: rooms.find(item => item.role === 'kitchen') ?? rooms[0], x: 5, y: 5, width: 48, height: 34 },
    { room: rooms.find(item => item.role === 'dining') ?? rooms[1], x: 57, y: 5, width: 55, height: 34 },
    { room: rooms.find(item => item.role === 'bathroom') ?? rooms[0], x: 5, y: 43, width: 27, height: 24 },
    { room: rooms.find(item => item.role === 'staircase') ?? rooms[0], x: 5, y: 71, width: 27, height: 19 },
    { room: rooms.find(item => item.role === 'living') ?? rooms[0], x: 36, y: 43, width: 44, height: 47 },
    { room: rooms.find(item => item.role === 'bedroom') ?? rooms[0], x: 84, y: 43, width: 28, height: 26 },
    { room: rooms.find(item => item.role === 'utility') ?? rooms[0], x: 84, y: 73, width: 28, height: 17 }
  ]

  return <div className="three-canvas">
    <Canvas camera={{ position: [8, 8, 9], fov: 40 }} dpr={[1, 1.5]} shadows>
      <color attach="background" args={['#d9ded6']}/>
      <ambientLight intensity={0.85}/>
      <directionalLight position={[5, 9, 6]} intensity={1.7} castShadow/>
      {isPlot
        ? view.startsWith('Nearby')
          ? property && <NearbyScene property={property} selectedPlace={selectedNearby} onSelectPlace={setSelectedNearby}/>
          : <PlotScene plots={plots} selectedPlot={selectedPlot} onSelectPlot={onSelectPlot} propertyName={property?.name ?? 'NOVARA'}/>
        : view === 'Dollhouse' || view === 'Ground floor' || view === 'Upper floor'
          ? <DollhouseScene rooms={rooms} design={design} floor={view === 'Ground floor' ? 'ground' : view === 'Upper floor' ? 'upper' : 'all'}/>
          : ['Front elevation', 'Rear elevation', 'Side elevation', 'Garden'].includes(view)
            ? <VillaExterior design={design}/>
            : <RoomScene room={activeRoom} design={design}/>}
      <ContactShadows position={[0, -0.1, 0]} opacity={0.3} blur={2.2} scale={16}/>
      <Environment preset="city"/>
      <CameraPreset view={view}/>
      <OrbitControls makeDefault enablePan enableZoom minDistance={2.5} maxDistance={view.startsWith('Nearby') ? 30 : 20} maxPolarAngle={Math.PI / 2.03} target={isPlot ? [0, 0, 0] : [0, 1, 0]}/>
    </Canvas>
    <div className={`viewer-controls${isPlot ? ' viewer-map-tabs' : ''}`} role="group" aria-label={isPlot ? 'Choose site or nearby places view' : 'Choose model view'}>{views.map(item => {
      const active = view === item || (item === 'Site' && view === 'Ground view')
      return <button type="button" className={active ? 'active' : ''} aria-pressed={active} key={item} onClick={() => setView(item)}>{item}</button>
    })}</div>
    {isPlot && <button type="button" className="viewer-ground-toggle" aria-pressed={view === 'Ground view'} onClick={() => setView(view === 'Ground view' ? 'Site' : 'Ground view')}>{view === 'Ground view' ? 'Ground view · on' : 'Ground view'}</button>}
    {!isPlot && <div className="viewer-floorplan"><span>INTERACTIVE SAMPLE FLOOR PLAN</span><svg viewBox="0 0 118 95" role="group" aria-label="Choose a room from the sample floor plan">{floorPlanRooms.map(({room, ...position})=><g key={room.name} role="button" tabIndex={0} aria-label={`Show ${room.name}`} aria-pressed={view === room.name} onClick={()=>setView(room.name)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setView(room.name)}}}><rect x={position.x} y={position.y} width={position.width} height={position.height} className={view===room.name?'active':''}/><text x={position.x+position.width/2} y={position.y+position.height/2} textAnchor="middle" dominantBaseline="middle">{room.name.split(' ')[0].toUpperCase()}</text></g>)}</svg></div>}
    <div className="viewer-hint">Drag to rotate · Scroll to zoom · Right-drag to pan</div>
    {isPlot && selectedPlot && <div className="viewer-selected-plot" aria-live="polite"><strong>{selectedPlot.number}</strong><span>{selectedPlot.size} · {formatPrice(selectedPlot.price)} · {selectedPlot.status}</span></div>}
    {isPlot && view.startsWith('Nearby') && <div className="viewer-nearby-note" aria-live="polite">
      {selectedNearby
        ? <><strong>{selectedNearby.name}</strong><span>{selectedNearby.type} · {selectedNearby.distanceKm.toFixed(1)} km · illustrative direction and distance</span></>
        : <><strong>Nearby places · demo map</strong><span>Select a landmark label to see its sample details</span></>}
    </div>}
    {!isPlot && <p className="viewer-room-note">{['Dollhouse', 'Ground floor', 'Upper floor'].includes(view) ? `${view} · furnished, open-sided procedural cutaway` : !['Front elevation', 'Rear elevation', 'Side elevation', 'Garden'].includes(view) ? `${view} · ${activeRoom.widthFt} × ${activeRoom.depthFt} ft sample room` : `${view} · ${design.style} · distinct procedural demo model`} · not a verified architectural design</p>}
  </div>
}
