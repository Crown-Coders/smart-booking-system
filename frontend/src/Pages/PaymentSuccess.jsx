import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  const handleOk = () => {
    navigate("/dashboard"); // Redirect to user dashboard
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment Successful!</h2>
      <p>Your booking has been confirmed.</p>
      <button onClick={handleOk} style={{ marginTop: "20px", padding: "10px 20px" }}>
        OK
      </button>
    </div>
  );
}

export default PaymentSuccess;
