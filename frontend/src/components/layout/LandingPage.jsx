import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/images/hp_illustrated_buttons_desktop_individual_default.png";
import whyUsImg from "../../assets/images/hp_illustrated_buttons_mobile_couples.png";
import feature1 from "../../assets/images/green-woman.png";
import feature2 from "../../assets/images/hp_illustrated_buttons_desktop_teen_default.png";
import howItWorksImg from "../../assets/images/image-how-it-works-3.png";
import therapyConceptImg from "../../assets/images/psychotherapy-abstract-concept-illustration-vector.jpg";

export default function LandingPage() {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      <section className="hero hero--editorial">
        <div className="hero__glow hero__glow--left" />
        <div className="hero__glow hero__glow--right" />
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="hero-kicker">Private online therapy, designed with calm in mind</p>
            <h1>Find the right therapist without turning care into admin work.</h1>
            <p>
              Mental.com helps clients discover verified professionals, book sessions quickly,
              and manage their care journey in one polished place.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="primary-btn">Start Your Journey</Link>
              <Link to="/services" className="secondary-btn">Browse Services</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>Flexible</strong>
                <span>Book around your real schedule</span>
              </div>
              <div className="hero-stat">
                <strong>Private</strong>
                <span>Secure access to sessions and history</span>
              </div>
              <div className="hero-stat">
                <strong>Clear</strong>
                <span>Professional booking and payment flow</span>
              </div>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-image-card">
              <img src={heroImg} alt="Wellness illustration" className="hero-image-actual" />
            </div>
          </div>
        </div>
      </section>

      <section className="section fade-in">
        <div className="container editorial-band">
          <div>
            <p className="section-tag">How It Works</p>
            <h2>Care should feel guided, not overwhelming.</h2>
          </div>
          <p className="section-subtext">
            Explore a service, choose a therapist, pay securely, and keep track of your next
            appointment without switching between disconnected tools.
          </p>
        </div>
        <div className="container landing-showcase">
          <div className="landing-showcase__copy">
            <div className="steps">
              <div className="step">
                <div className="step-icon">1</div>
                <h3>Choose your support</h3>
                <p>From counselling to educational psychology, the service list stays easy to scan.</p>
              </div>
              <div className="step">
                <div className="step-icon">2</div>
                <h3>Select a therapist</h3>
                <p>Compare specialties and experience before committing to a session.</p>
              </div>
              <div className="step">
                <div className="step-icon">3</div>
                <h3>Book with confidence</h3>
                <p>Appointments, payment, and follow-up all stay visible from your account.</p>
              </div>
            </div>
          </div>
          <div className="landing-showcase__image">
            <img alt="Mental.com mobile interface" src={howItWorksImg} className="image-actual" />
          </div>
        </div>
      </section>

      <section className="section fade-in">
        <div className="container">
          <p className="section-tag">Why Mental.com</p>
          <h2>Everything you need, without the clutter.</h2>
          <div className="card-grid">
            <div className="card card--feature">
              <img src={feature1} alt="Flexible communication" className="card-image-actual" />
              <h3>Flexible communication</h3>
              <p>Move from discovery to booking in a flow that feels calm and professional.</p>
            </div>
            <div className="card card--feature">
              <img src={feature2} alt="Teenager resting" className="card-image-actual" />
              <h3>Easy scheduling</h3>
              <p>See what is available and secure a session without long back-and-forth messages.</p>
            </div>
            <div className="card card--feature">
              <img alt="Couple hugging" className="card-image-actual" src={whyUsImg} />
              <h3>Support that adapts</h3>
              <p>Find the practitioner who matches your current needs, then return whenever you need care.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section light fade-in">
        <div className="container privacy-grid">
          <div>
            <p className="section-tag">Trust & Comfort</p>
            <h2>Your wellbeing deserves a platform that feels safe.</h2>
            <p className="section-subtext section-subtext--left">
              Verified professionals, a clear booking trail, and a calmer interface all help reduce the
              friction that usually comes with finding support.
            </p>
            <Link to="/login" className="primary-btn">Return To Your Account</Link>
          </div>
          <img
            src={therapyConceptImg}
            alt="Therapy session illustration"
            className="image-actual privacy-image"
          />
        </div>
      </section>

      <section className="section fade-in action-section">
        <div className="container action-panel">
          <div>
            <p className="section-tag section-tag--light">Ready when you are</p>
            <h2>Start with the service that fits your season of life.</h2>
          </div>
          <div className="cta-centered">
            <Link to="/services" className="primary-btn large">Explore Services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
