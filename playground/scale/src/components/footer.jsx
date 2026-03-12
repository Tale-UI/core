import React from 'react'
import styled from 'styled-components'

const FooterSection = styled.div`
  a {
    color: inherit;
    text-underline-position: under;
    text-decoration-color: var(--bodyDimmed);
  }

  h1 {
    font-size: inherit;
    line-height: inherit;
    font-weight: normal;
    display: inline-block;
  }
`

const Footer = () => (
  <FooterSection>
    This tool is for the <a href='https://github.com/Tale-UI/scale' target='_blank' rel='noopener noreferrer'><h1>Tale-UI/scale</h1></a> project on GitHub.
  </FooterSection>
)

export default Footer
