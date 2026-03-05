import React, { useState } from "react";

function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Functions to open and close the pop-up
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>© {new Date().getFullYear()} Crown Coders. All rights reserved.</p>
          
          {/* The clickable link that opens the pop-up */}
          <button onClick={openModal} style={styles.policyLink}>
            Terms & Policies
          </button>
        </div>
      </footer>

      {/* The Pop-up Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          {/* e.stopPropagation() prevents closing when clicking INSIDE the white box */}
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            
            <button onClick={closeModal} style={styles.closeButton}>
              &times; {/* This creates an "X" icon */}
            </button>

            <div style={styles.modalText}>
              <h1 style={{ color: "#002324", marginBottom: "0.5rem", fontSize: "1.8rem" }}>Terms and Conditions & Booking Policies</h1>
              <p style={{ color: "#A1AD95", marginBottom: "2rem", fontStyle: "italic" }}>Last updated: March 2026</p>

              <div style={{ color: "#4A5568", lineHeight: "1.6", fontSize: "1rem" }}>
                <h2 style={{ color: "#002324", marginTop: "1.5rem", fontSize: "1.2rem" }}>1. Introduction</h2>
                <p>Welcome to Mental.com. By accessing our website and booking sessions through our platform, you agree to abide by these Terms and Conditions. Our platform connects clients with licensed therapists for online counseling and therapy services.</p>

                <h2 style={{ color: "#002324", marginTop: "1.5rem", fontSize: "1.2rem" }}>2. Medical Emergency Disclaimer</h2>
                <p><strong>Mental.com is not an emergency healthcare provider.</strong> Our services are not suitable for individuals in an immediate crisis or those experiencing suicidal thoughts. If you are experiencing a medical or mental health emergency, please immediately call your local emergency services or go to the nearest hospital.</p>

                <h2 style={{ color: "#002324", marginTop: "1.5rem", fontSize: "1.2rem" }}>3. Payments and Billing</h2>
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Upfront Payment:</strong> All therapy sessions must be paid in full at the time of booking to secure your appointment with the therapist.</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Secure Processing:</strong> Payments are processed through secure, encrypted third-party payment gateways. Mental.com does not store your direct credit card information.</li>
                </ul>

                <h2 style={{ color: "#002324", marginTop: "1.5rem", fontSize: "1.2rem" }}>4. No Refund Policy</h2>
                <p>To respect the time and schedule of our licensed therapists, <strong>Mental.com operates strictly on a no-refund policy.</strong></p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "0.5rem" }}>Once a session is booked and paid for, the payment is final.</li>
                  <li style={{ marginBottom: "0.5rem" }}>Refunds will not be issued for missed sessions ("no-shows"), late arrivals, or cancellations.</li>
                  <li style={{ marginBottom: "0.5rem" }}>If you are unhappy with your current therapist, you may switch to a new therapist for future sessions at no additional transfer cost, but past sessions cannot be refunded.</li>
                </ul>

                <h2 style={{ color: "#002324", marginTop: "1.5rem", fontSize: "1.2rem" }}>5. Rescheduling and Cancellations</h2>
                <p>While we do not offer refunds, we understand that life happens. We offer a flexible rescheduling policy:</p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "0.5rem" }}><strong>24-Hour Notice:</strong> You may reschedule your appointment without any penalty as long as you do so at least 24 hours before your scheduled session time.</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>Late Rescheduling:</strong> If you attempt to reschedule within 24 hours of your session, it will be considered a cancellation, and you will need to book and pay for a new session.</li>
                  <li style={{ marginBottom: "0.5rem" }}><strong>How to Reschedule:</strong> You can easily reschedule your session by logging into your Mental.com dashboard and selecting a new available time slot for your therapist.</li>
                </ul>

                <h2 style={{ color: "#002324", marginTop: "1.5rem", fontSize: "1.2rem" }}>6. User Responsibilities</h2>
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "0.5rem" }}>You agree to provide accurate, current, and complete information during the registration and booking process.</li>
                  <li style={{ marginBottom: "0.5rem" }}>You are responsible for maintaining a stable internet connection and a private, safe environment for your online therapy sessions.</li>
                </ul>

                <h2 style={{ color: "#002324", marginTop: "1.5rem", fontSize: "1.2rem" }}>7. Privacy and Confidentiality</h2>
                <p>Your privacy is our top priority. All communications between you and your therapist are strictly confidential and encrypted. Mental.com complies with standard data protection regulations to ensure your personal and health information is never shared with unauthorized third parties.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Inline styles for the footer and the modal
const styles = {
  footer: {
    backgroundColor: "#002324",
    color: "#E5DDDE",
    padding: "1.5rem",
    marginTop: "auto", 
  },
  footerContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  policyLink: {
    background: "none",
    border: "none",
    color: "#EBFACF",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "0",
  },
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 35, 36, 0.7)", // Dark transparent background
    zIndex: 9999, // Ensures it sits on top of everything including the navbar
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "85vh", // Prevents it from being taller than the screen
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "20px",
    background: "none",
    border: "none",
    fontSize: "2rem",
    color: "#002324",
    cursor: "pointer",
    lineHeight: "1",
  },
  modalText: {
    padding: "2.5rem 2rem",
    overflowY: "auto", // Makes the text scrollable inside the box!
    textAlign: "left",
  }
};

export default Footer;