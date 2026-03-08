import { useParams } from "react-router-dom";

function PaymentCancel() {
  const { bookingId } = useParams();
  return <div>Payment cancelled. Try again for booking #{bookingId}.</div>;
}
export default PaymentCancel;