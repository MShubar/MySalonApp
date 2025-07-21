import Dropdown from 'react-bootstrap/Dropdown'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import useNavbar from '../../functionality/layout/UseNavbar'
const Navbar = ({ setUserType, userType, user }) => {
  const {
    t,
    i18n,
    types,
    currentIcon,
    setCurrentIcon,
    toggleLanguage,
    handleLogout,
    navLinks,
    location
  } = useNavbar({ userType, setUserType })

  return (
    <>
      <nav
        className="navbar px-4 py-2 mb-3 border-bottom"
        style={{
          backgroundColor: '#121212',
          borderColor: '#2c2c2c',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          boxShadow: '0 2px 8px rgb(0 0 0 / 0.7)'
        }}
        aria-label={t('Main Navigation')}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* User Account Dropdown */}
          <Dropdown align="start">
            <Dropdown.Toggle
              variant="dark"
              className="p-0 rounded-circle border-0 shadow"
              style={{ width: 40, height: 40, backgroundColor: '#1f1f1f' }}
              id="user-dropdown-toggle"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i
                className="bi bi-person-circle fs-3 text-secondary"
                aria-hidden="true"
              ></i>
              <span className="visually-hidden">{t('User Account Menu')}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="shadow-sm border-0 rounded-3"
              style={{ backgroundColor: '#1f1f1f', color: '#ddd' }}
              aria-label={t('User Account Options')}
            >
              {user ? (
                <>
                  <Dropdown.Header
                    className="fw-semibold fs-6"
                    style={{ color: '#4f8ef7' }}
                  >
                    {user.username || t('User')}
                  </Dropdown.Header>
                  <Dropdown.Item
                    as={Link}
                    to="/account"
                    className="d-flex align-items-center gap-2"
                    style={{ color: '#ddd' }}
                    tabIndex={0}
                  >
                    <i className="bi bi-pencil-square" aria-hidden="true"></i>{' '}
                    {t('Account')}
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ borderColor: '#444' }} />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="d-flex align-items-center gap-2 text-danger"
                    role="button"
                    tabIndex={0}
                  >
                    <i className="bi bi-box-arrow-right" aria-hidden="true"></i>{' '}
                    {t('Logout')}
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Header style={{ color: '#ddd' }}>
                    {t('Guest')}
                  </Dropdown.Header>
                  <Dropdown.Divider style={{ borderColor: '#444' }} />
                  <Dropdown.Item
                    as={Link}
                    to="/signin"
                    className="d-flex align-items-center gap-2"
                    style={{ color: '#ddd' }}
                    tabIndex={0}
                  >
                    <i
                      className="bi bi-box-arrow-in-right"
                      aria-hidden="true"
                    ></i>{' '}
                    {t('Sign In')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/signup"
                    className="d-flex align-items-center gap-2"
                    style={{ color: '#ddd' }}
                    tabIndex={0}
                  >
                    <i className="bi bi-person-plus" aria-hidden="true"></i>{' '}
                    {t('Sign Up')}
                  </Dropdown.Item>
                </>
              )}
              {/* Language Toggle - always visible */}
              <Dropdown.Divider style={{ borderColor: '#444' }} />
              <Dropdown.Item onClick={toggleLanguage} style={{ color: '#ddd' }}>
                <i className="bi bi-globe2 me-2"></i>
                {i18n.language === 'en' ? 'العربية' : 'English'}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Type Selector */}
          <Dropdown align="center">
            <Dropdown.Toggle
              variant="dark"
              className="d-flex align-items-center gap-2 px-3 py-1 border rounded shadow-sm"
              style={{
                minWidth: 140,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.95rem',
                backgroundColor: '#1f1f1f',
                borderColor: '#333',
                color: '#ddd',
                transition: 'background-color 0.25s ease'
              }}
              id="user-type-dropdown-toggle"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label={t('Select User Type')}
            >
              {currentIcon ? (
                <img
                  src={currentIcon}
                  alt={userType}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow: '0 0 8px rgba(79, 142, 247, 0.7)'
                  }}
                />
              ) : (
                <i
                  className="bi bi-person-badge fs-5 text-secondary"
                  aria-hidden="true"
                ></i>
              )}
              <span className="text-capitalize flex-grow-1">
                {t(userType) || t('Select Type')}
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="shadow-sm border-0 rounded-3"
              style={{ backgroundColor: '#1f1f1f', color: '#ddd' }}
              aria-label={t('User Types')}
            >
              {types.length ? (
                types.map((type, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => {
                      setUserType(type.type_name)
                      setCurrentIcon(type.image_url)
                    }}
                    className="d-flex align-items-center gap-3"
                    style={{ fontWeight: 500, color: '#ddd' }}
                    tabIndex={0}
                    role="button"
                  >
                    <img
                      src={type.image_url}
                      alt={type.type_name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 0 5px rgba(79, 142, 247, 0.7)'
                      }}
                    />
                    <span className="text-capitalize">{t(type.type_name)}</span>
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item disabled style={{ color: '#777' }}>
                  {t('Loading user types...')}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* Cart Icon in Top Right */}
          <Link to="/cart" title={t('Cart')}>
            <button
              className="btn btn-outline-primary btn-sm"
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            >
              <i className="bi bi-cart3 fs-5"></i>
            </button>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div
          className="container-fluid mt-3"
          role="navigation"
          aria-label={t('Primary Navigation Links')}
        >
          <div
            className="d-flex gap-2"
            style={{
              overflowX: 'auto',
              paddingTop: 14,
              paddingBottom: 14,
              scrollbarWidth: 'thin',
              msOverflowStyle: 'auto',
              whiteSpace: 'normal'
            }}
            tabIndex={0}
            aria-roledescription="scrollable list"
          >
            {navLinks.map(({ to, label }, idx) => (
              <Link
                key={idx}
                to={to}
                className="btn btn-outline-primary btn-sm text-capitalize fw-semibold px-3"
                style={{
                  minWidth: 110,
                  maxWidth: 110,
                  fontSize: '0.95rem',
                  borderRadius: '0.5rem',
                  borderColor: '#4f8ef7',
                  whiteSpace: 'normal',
                  height: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  userSelect: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                  boxShadow:
                    location.pathname === to ? '0 0 12px #4f8ef7' : 'none',
                  backgroundColor:
                    location.pathname === to ? '#4f8ef7' : 'transparent',
                  color: location.pathname === to ? '#fff' : '#4f8ef7'
                }}
                aria-current={location.pathname === to ? 'page' : undefined}
              >
                {t(label)}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}

Navbar.propTypes = {
  setUserType: PropTypes.func.isRequired,
  userType: PropTypes.string,
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired
}

export default Navbar
