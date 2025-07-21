import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background-color: #4f8ef7;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
  z-index: 1000;
`

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false)

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    setVisible(scrollTop > 300)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Button onClick={scrollToTop} aria-label="Scroll to top" $visible={visible}>
      <i className="bi bi-chevron-up"></i>
    </Button>
  )
}

export default ScrollToTop
