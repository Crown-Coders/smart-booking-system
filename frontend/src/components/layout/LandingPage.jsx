import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import heroImg from "../../assets/images/hp_illustrated_buttons_desktop_individual_default.png";
import whyUsImg from "../../assets/images/hp_illustrated_buttons_mobile_couples.png";
import feature1 from "../../assets/images/green-woman.png";
import feature2 from "../../assets/images/hp_illustrated_buttons_desktop_teen_default.png";
import trustImg from "../../assets/images/divider-main-4-mobile.png";
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

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <h1>Feel better, Heal faster - with the right therapist.</h1>
            <p>
              Book trusted therapists online in minutes. Simple, private, and flexible.
            </p>  
            <div className="hero-buttons">
              <Link to="/register" className="primary-btn">Get Started</Link>
              <Link to="/login" className="secondary-btn">Login</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img src={heroImg} alt="Woman relaxing" className="hero-image-actual" />
          </div>
        </div>
      </section>

     

      {/* WHY MENTAL.COM */}
      <section className="section fade-in">
        <div className="container">
          <h2>Why choose Mental.com?</h2>
          <p className="section-subtext">
            No more phone tag or scheduling conflicts. We make finding and booking a therapist as easy as ordering a coffee.
          </p>
          <img
            alt="Mental.com mobile interface" 
            src={howItWorksImg} 
            style={{ 
              width: "100%", 
              maxWidth: "600px", /* Increased size to fit both phones beautifully */
              height: "auto", 
              display: "block", 
              margin: "0 auto" 
            }} 
          />
          
        </div>
      </section>

      {/* FEATURES */}
      <section className="section fade-in">
        <div className="container">
          <h2>Everything you need, all in one place</h2>
          <div className="card-grid">
            <div className="card">
              <img src={feature1} alt="Flexible communication" className="card-image-actual" />
              <h3>Flexible communication</h3>
              <p>Message, chat, or video call — you choose.</p>
            </div>
            <div className="card">
              <img src={feature2} alt="Teenager resting" className="card-image-actual" />
              <h3>Easy scheduling</h3>
              <p>See real‑time availability and book instantly.</p>
            </div>
            <div className="card">
              {/* FIX: Removed the HTML </img> tag, made it self-closing, updated to className, and used imported image */}
              <img alt="Couple hugging" className="card-image-actual" src={whyUsImg} />
              <h3>Switch anytime</h3>
              <p>Not a match? Change therapists with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & SAFETY */}
      <section className="section light fade-in">
        <div className="container">
          <h2>Your privacy and comfort come first</h2>
          <p className="section-subtext">
            All therapists are licensed and verified. Your data is encrypted and never shared.
          </p>
   <img 
            src={therapyConceptImg} 
            alt="Therapy session illustration" 
            className="image-actual" 
            style={{ 
              maxWidth: "600px", /* Makes it nice and wide */
              borderRadius: "20px" /* Softens the edges of the square image */
            }} 
          />
          
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="section fade-in action-section">
        <div className="container">
          <h2>Start your journey today</h2>
          <p className="section-subtext">
            Join thousands of people who have found the right therapist through Mental.com.
          </p>
          <div className="cta-centered">
            <Link to="/register" className="primary-btn large">Find my therapist</Link>
          </div>
        </div>
      </section>
    </div>
  );
}