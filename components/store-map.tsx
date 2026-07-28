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
  const markersRef = useRef<any[]>([])

  // Initialize map once on mount
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    import('leaflet').then((L) => {
      try {
        const center = stores[0]?.coordinates || { lat: 40.7128, lng: -74.006 }
        mapRef.current = L.map(mapContainer.current!).setView([center.lat, center.lng], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapRef.current)
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = []
      }
    }
  }, [])

  // Update markers when stores or selection changes
  useEffect(() => {
    if (!mapRef.current) return

    import('leaflet').then((L) => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      // Add new markers
      stores.forEach((store) => {
        const isSelected = store.id === selectedStoreId
        const markerColor = isSelected ? '#10b981' : '#3b82f6'

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
        })

        marker.addTo(mapRef.current)
        markersRef.current.push(marker)
      })
    })
  }, [stores, selectedStoreId, onStoreSelect])

  return (
    <div 
      ref={mapContainer} 
      className={`${height} rounded-lg border border-border overflow-hidden bg-muted`}
      style={{ zIndex: 1 }}
    />
  )
}
