"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

// Load Stripe with the publishable key from environment variables
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    phone: "",
  });
  const router = useRouter();
  const elements = useElements();

  // Example static total amount, you should calculate this dynamically based on cart data
  const totalAmount = 100;

  useEffect(() => {
    // Create the payment intent
    const createPaymentIntent = async () => {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    };

    createPaymentIntent();
  }, [totalAmount]);

  const validateForm = () => {
    return (
      !shippingDetails.name ||
      !shippingDetails.email ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.zip ||
      !shippingDetails.country ||
      !shippingDetails.phone
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const stripe = await stripePromise;

    if (!stripe || !elements || !clientSecret) {
      setLoading(false);
      return;
    }

    // Confirm the payment with the client secret
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!, // CardElement for payment
          billing_details: {
            name: shippingDetails.name,
          },
        },
      }
    );

    if (error) {
      console.log("Payment error:", error.message);
      setLoading(false);
      alert("Payment failed: " + error.message);
    } else {
      // Payment succeeded
      console.log("Payment succeeded:", paymentIntent);
      router.push("/thank-you"); // Redirect to the Thank You page after payment
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 custom_container">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-full max-w-lg rounded-xl shadow-md"
      >
        <h1 className="text-2xl font-bold text-primary mb-6">Checkout</h1>

        {/* Shipping Information */}
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="name"
            value={shippingDetails.name}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, name: e.target.value })
            }
            placeholder="Full Name"
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <input
            type="email"
            name="email"
            value={shippingDetails.email}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, email: e.target.value })
            }
            placeholder="Email"
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <input
            type="text"
            name="address"
            value={shippingDetails.address}
            onChange={(e) =>
              setShippingDetails({
                ...shippingDetails,
                address: e.target.value,
              })
            }
            placeholder="Address"
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <input
            type="text"
            name="city"
            value={shippingDetails.city}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, city: e.target.value })
            }
            placeholder="City"
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <input
            type="text"
            name="zip"
            value={shippingDetails.zip}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, zip: e.target.value })
            }
            placeholder="ZIP Code"
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <input
            type="text"
            name="country"
            value={shippingDetails.country}
            onChange={(e) =>
              setShippingDetails({
                ...shippingDetails,
                country: e.target.value,
              })
            }
            placeholder="Country"
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <input
            type="tel"
            name="phone"
            value={shippingDetails.phone}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, phone: e.target.value })
            }
            placeholder="Phone Number"
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
        </div>

        {/* Stripe Card Element */}
        <div className="mt-4">
          <label htmlFor="card">Card Details</label>
          <CardElement id="card" className="border p-2 mb-6" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg text-lg font-semibold transition ${
            loading || validateForm()
              ? "bg-primary/70 text-white cursor-wait"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
          disabled={loading || validateForm()}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

// Wrap the entire CheckoutPage with Elements component, passing the Stripe object
const WrappedCheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
};

export default WrappedCheckoutPage;
