'use client'

import { useEffect, useRef } from 'react'
import type { Store } from '@/lib/types'

interface StoreMapProps {
  stores: Store[]
  selectedStoreId: string | null
  onStoreSelect: (storeId: string) => void
  height?: string
}

export function StoreMap({ stores, selectedStoreId, onStoreSelect, height = 'h-96' }: StoreMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Dynamic import to ensure it works on client side
    import('leaflet').then((L) => {
      // Initialize map centered on first store or default location
      const center = stores[0]?.coordinates || { lat: 40.7128, lng: -74.006 }
      
      mapRef.current = L.map(mapContainer.current!).setView([center.lat, center.lng], 13)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)

      // Add store markers
      stores.forEach((store) => {
        const isSelected = store.id === selectedStoreId
        const markerColor = isSelected ? '#10b981' : '#3b82f6'
        
        // Create custom HTML icon
        const customIcon = L.divIcon({
          html: `
            <div style="
              background-color: ${markerColor};
              color: white;
              border-radius: 50%;
              width: ${isSelected ? '40px' : '32px'};
              height: ${isSelected ? '40px' : '32px'};
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              📍
            </div>
          `,
          iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
          iconAnchor: [isSelected ? 20 : 16, isSelected ? 40 : 32],
          popupAnchor: [0, -32],
        })

        const marker = L.marker([store.coordinates.lat, store.coordinates.lng], { icon: customIcon })
        
        marker.bindPopup(`
          <div style="width: 200px; font-family: system-ui;">
            <strong>${store.name}</strong><br/>
            <small>${store.address}</small><br/>
            <div style="margin-top: 8px; font-size: 12px; display: flex; gap: 8px;">
              <span>⭐ ${store.rating}</span>
              <span>⏱️ ${store.deliveryTime}m</span>
              <span>📍 ${store.distance}km</span>
            </div>
          </div>
        `)

        marker.on('click', () => {
          onStoreSelect(store.id)
          marker.openPopup()
        })

        marker.addTo(mapRef.current)
      })
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [stores, selectedStoreId, onStoreSelect])

  return (
    <div 
      ref={mapContainer} 
      className={`${height} rounded-lg border border-border overflow-hidden bg-muted`}
      style={{ zIndex: 1 }}
    />
  )
}
