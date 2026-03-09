import React, { useState } from "react";

function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>© {new Date().getFullYear()} Crown Coders. All rights reserved.</p>
          <button onClick={openModal} style={styles.policyLink}>
            Terms & Policies
          </button>
        </div>
      </footer>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            {/* Soft gradient header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Terms and Policies</h2>
              <button onClick={closeModal} style={styles.closeButton}>&times;</button>
            </div>

            <div style={styles.modalBody}>
              <p style={styles.lastUpdated}>Last updated: March 2026</p>
              
              <h3>1. Introduction</h3>
              <p>Welcome to Mental.com. By accessing our website and booking sessions through our platform, you agree to abide by these Terms and Conditions. Our platform connects clients with licensed therapists for online counseling and therapy services.</p>

              <h3>2. Medical Emergency Disclaimer</h3>
              <p><strong>Mental.com is not an emergency healthcare provider.</strong> Our services are not suitable for individuals in an immediate crisis or those experiencing suicidal thoughts. If you are experiencing a medical or mental health emergency, please immediately call your local emergency services or go to the nearest hospital.</p>

              <h3>3. Payments and Billing</h3>
              <ul>
                <li><strong>Upfront Payment:</strong> All therapy sessions must be paid in full at the time of booking to secure your appointment with the therapist.</li>
                <li><strong>Secure Processing:</strong> Payments are processed through secure, encrypted third-party payment gateways. Mental.com does not store your direct credit card information.</li>
              </ul>

              <h3>4. No Refund Policy</h3>
              <p>To respect the time and schedule of our licensed therapists, <strong>Mental.com operates strictly on a no-refund policy.</strong></p>
              <ul>
                <li>Once a session is booked and paid for, the payment is final.</li>
                <li>Refunds will not be issued for missed sessions ("no-shows"), late arrivals, or cancellations.</li>
                <li>If you are unhappy with your current therapist, you may switch to a new therapist for future sessions at no additional transfer cost, but past sessions cannot be refunded.</li>
              </ul>

              <h3>5. Rescheduling and Cancellations</h3>
              <p>While we do not offer refunds, we understand that life happens. We offer a flexible rescheduling policy:</p>
              <ul>
                <li><strong>24-Hour Notice:</strong> You may reschedule your appointment without any penalty as long as you do so at least 24 hours before your scheduled session time.</li>
                <li><strong>Late Rescheduling:</strong> If you attempt to reschedule within 24 hours of your session, it will be considered a cancellation, and you will need to book and pay for a new session.</li>
                <li><strong>How to Reschedule:</strong> You can easily reschedule your session by logging into your Mental.com dashboard and selecting a new available time slot for your therapist.</li>
              </ul>

              <h3>6. User Responsibilities</h3>
              <ul>
                <li>You agree to provide accurate, current, and complete information during the registration and booking process.</li>
                <li>You are responsible for maintaining a stable internet connection and a private, safe environment for your online therapy sessions.</li>
              </ul>

              <h3>7. Privacy and Confidentiality</h3>
              <p>Your privacy is our top priority. All communications between you and your therapist are strictly confidential and encrypted. Mental.com complies with standard data protection regulations to ensure your personal and health information is never shared with unauthorized third parties.</p>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.closeFooterBtn} onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 35, 36, 0.7)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  modalHeader: {
    background: "linear-gradient(135deg, #e5ddde, #a1ad95)",
    padding: "1.5rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "none",
  },
  modalTitle: {
    margin: 0,
    color: "#002324",
    fontSize: "1.5rem",
    fontWeight: 600,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "2rem",
    color: "#002324",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 0.5rem",
  },
  modalBody: {
    padding: "2rem",
    overflowY: "auto",
    textAlign: "left",
    color: "#333",
    lineHeight: 1.6,
  },
  lastUpdated: {
    color: "#A1AD95",
    fontStyle: "italic",
    marginBottom: "1.5rem",
  },
  modalFooter: {
    padding: "1rem 2rem",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "flex-end",
  },
  closeFooterBtn: {
    backgroundColor: "transparent",
    border: "2px solid #002324",
    color: "#002324",
    borderRadius: "30px",
    padding: "0.5rem 2rem",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Footer;
