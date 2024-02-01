import React from 'react'
import { Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'

const NavbarComponent = () => {
  return (
    <Navbar expand="lg" className="body-tertiary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">Contacts</Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default NavbarComponent