import React from 'react';

function AboutUs() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About The Healthy Grandparent</h1>
        <p className="about-subtitle">Empowering grandparents to lead active, healthy lives</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At The Healthy Grandparent, we're dedicated to helping grandparents maintain their health, 
            strength, and independence through safe, effective, and enjoyable physical activities. 
            We understand that staying active is crucial for maintaining quality of life, and we're 
            here to make that journey accessible and enjoyable.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Safe Workouts</h3>
              <p>Carefully designed exercises that prioritize safety and proper form, suitable for all fitness levels.</p>
            </div>
            <div className="feature-card">
              <h3>Expert Guidance</h3>
              <p>Professional fitness programs created by certified trainers specializing in senior fitness.</p>
            </div>
            <div className="feature-card">
              <h3>Community Support</h3>
              <p>A supportive community of like-minded individuals on the same health journey.</p>
            </div>
            <div className="feature-card">
              <h3>Flexible Programs</h3>
              <p>Workouts that can be done at home or in a gym, with modifications for different abilities.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Approach</h2>
          <p>
            We believe that age is just a number, and it's never too late to start taking care of your health. 
            Our programs are designed to be:
          </p>
          <ul className="approach-list">
            <li>Safe and effective for all fitness levels</li>
            <li>Easy to follow and understand</li>
            <li>Focused on maintaining independence</li>
            <li>Adaptable to individual needs</li>
            <li>Fun and engaging</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Join Our Community</h2>
          <p>
            Whether you're looking to maintain your current fitness level or start a new health journey, 
            The Healthy Grandparent is here to support you every step of the way. Join our community 
            today and take the first step towards a healthier, more active lifestyle.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutUs; 