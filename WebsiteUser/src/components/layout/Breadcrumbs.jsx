import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Nav = styled.nav`
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #ccc;
`

const CrumbLink = styled(Link)`
  color: #a3c1f7;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Separator = styled.span`
  margin: 0 0.5rem;
`

const Breadcrumbs = ({ items }) => (
  <Nav aria-label="breadcrumb">
    {items.map((item, idx) => (
      <span key={idx}>
        {idx > 0 && <Separator>/</Separator>}
        {item.to ? <CrumbLink to={item.to}>{item.label}</CrumbLink> : item.label}
      </span>
    ))}
  </Nav>
)

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string
    })
  ).isRequired
}

export default Breadcrumbs
