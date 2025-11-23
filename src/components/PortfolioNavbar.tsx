import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import '../App.css';

/* Removed setDarkMode from props since we don't need it here anymore */
function MyNavbar({ darkMode }: { darkMode: boolean }) {
  return (
    <Navbar
      expand="lg"
      bg={darkMode ? 'dark' : 'white'}
      variant={darkMode ? 'dark' : 'light'}
      data-bs-theme={darkMode ? 'dark' : 'light'} /* Add this line */
      className={darkMode ? 'bg-dark navbar-dark' : 'bg-white navbar-light'}
    >
      <Container className="justify-content-center">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/resume">Resume</Nav.Link> {/* Replaced dropdown with simple link */}
            <Nav.Link as={Link} to="/photos">Photos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;