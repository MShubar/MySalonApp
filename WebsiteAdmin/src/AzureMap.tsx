import React, { useEffect, useRef } from 'react'
import * as atlas from 'azure-maps-control'

const AzureMap = ({ setLocation }) => {
  const mapRef = useRef(null)

  useEffect(() => {
    const map = new atlas.Map(mapRef.current, {
      center: [50.5577, 26.0665], // Bahrain center (lng, lat)
      zoom: 9,
      authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey:
          '8cjefp8SgYBtDuPsFr5fOluH7lRZ4hi7EA9bSXdEuSCTokzugfq5JQQJ99BFACYeBjFxc5JwAAAgAZMPa8j7'
      },
      keyboardOptions: {
        enabled: true, // disable keyboard shortcuts entirely
        enableShortcutHelp: false // disable the help tooltip showing shortcuts info
      }
    })

    let marker

    map.events.add('click', (e) => {
      const { position } = e
      setLocation(`${position[1]},${position[0]}`)

      if (marker) {
        marker.remove()
      }

      marker = new atlas.HtmlMarker({
        position,
        htmlContent: `<div style="
          width: 24px;
          height: 24px;
          background-color: red;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.5);
          ">
        </div>`
      })
      marker.addTo(map)
    })

    return () => {
      map.dispose()
    }
  }, [setLocation])

  return (
    <div
      ref={mapRef}
      style={{
        width: '50%',
        height: '400px',
        marginTop: '10px',
        color: 'transparent',
        border: '2px solid #0078D4', // temporary visible border
        backgroundColor: '#e5e5e5' // light gray background to confirm visibility
      }}
    />
  )
}

export default AzureMap
