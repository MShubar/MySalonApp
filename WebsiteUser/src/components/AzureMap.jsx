import React, { useEffect, useRef } from 'react'
import * as atlas from 'azure-maps-control'

const AzureMap = ({ latitude, longitude }) => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (!latitude || !longitude) return

    // Initialize the map only once
    if (!mapInstance.current) {
      mapInstance.current = new atlas.Map(mapRef.current, {
        center: [longitude, latitude],
        zoom: 15,
        language: 'en-US',
        authOptions: {
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey:
            '8cjefp8SgYBtDuPsFr5fOluH7lRZ4hi7EA9bSXdEuSCTokzugfq5JQQJ99BFACYeBjFxc5JwAAAgAZMPa8j7' // replace this!
        }
      })

      // Add marker once the map is ready
      mapInstance.current.events.add('ready', () => {
        const marker = new atlas.HtmlMarker({
          color: 'deepskyblue',
          position: [longitude, latitude]
        })
        mapInstance.current.markers.add(marker)
      })
    } else {
      // If map already exists, update center and marker
      mapInstance.current.setCamera({
        center: [longitude, latitude],
        zoom: 15
      })

      // Remove previous markers and add new one
      mapInstance.current.markers.clear()
      const marker = new atlas.HtmlMarker({
        color: 'deepskyblue',
        position: [longitude, latitude]
      })
      mapInstance.current.markers.add(marker)
    }

    // Clean-up not necessary here unless you want to dispose the map on unmount
  }, [latitude, longitude])

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0, 123, 255, 0.4)'
      }}
    />
  )
}

export default AzureMap
