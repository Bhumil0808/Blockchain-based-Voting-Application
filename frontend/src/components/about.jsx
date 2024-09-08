import React from 'react';
import Spline from '@splinetool/react-spline';
import Navbar from './navbar'; // Assuming you have a Navbar component
import '../public/about.css'; // Import the CSS file for styling

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <Navbar />
      <div className="content">
        {/* Spline element for Blockchain */}
        <div className="spline-container">
          <Spline scene="https://prod.spline.design/xBacX-oO1nL0Ll4j/scene.splinecode" />
        </div>

        {/* Description of the project */}
        <div className="description">
          <h2>About BlackBallot</h2>
          <p>
            BlackBallot is a secure and transparent voting platform designed to revolutionize the way elections are conducted. 
            Leveraging the power of blockchain technology, BlackBallot ensures that every vote is counted accurately and securely.
            We are using the Ethereum blockchain to store all election data, ensuring transparency and immutability.
          </p>

          {/* Spline element for spinning Ethereum coin */}
          <div className="spline-eth-container">
            <Spline scene="https://prod.spline.design/Rebnz84Go0VH1msj/scene.splinecode" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
