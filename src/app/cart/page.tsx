"use client";
//@ts-nocheck
import { useCart } from "@/context/CartContext";
import { useState,useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Link from "next/link";
import Image from "next/image";
import { ShippingSettings } from "@/types/shipping";
import {Fetch} from "@/utils/Fetch";

// Initialize Stripe - Using your real publishable key
const stripePromise = loadStripe(
  "pk_test_51Pgm6hG8wbSCZBNDMNyM3tEPPimmPflanzEXvhoeuYXmqCQ21d3eeKbvXYAnxwyMe0pO6UED7tTN1TH4vPX44gsV00VInLUIMR"
);

// PayPal configuration
const paypalOptions = {
  clientId:
    "ARAJocZEMbwrchoZKID4PCm4MJNHkPp_tr0f3aO82cwmqu-PioeLfnL53nzp6EfrdoZPYJvAJogi3D1z",
  currency: "USD",
  intent: "capture",
};

// Define interfaces for type safety
interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface PaymentSuccessData {
  order_id?: string;
  payment_intent_id?: string;
  payment_id?: string;
  transaction_id?: string;
  payment_method?: string;
  redirect_url?: string;
  status?: string;
  message?: string;
}

// PayPal types will be handled by the SDK

const CheckoutForm = ({
  customerInfo,
  setCustomerInfo,
  cart,
  subtotal,
  shipping,
  total,
  onPaymentSuccess,
  onBack,
}: {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  onPaymentSuccess: (data: PaymentSuccessData) => void;
  onBack: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">(
    "stripe"
  );

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(
      // @ts-expect-error - React setState with computed property key
      (prev) =>
      ({
        ...prev,
        [field]: value,
      } as CustomerInfo)
    );
  };

  const handleStripeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setPaymentError("Stripe has not loaded yet. Please try again.");
      return;
    }

    // Check if all required fields are filled
    if (
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city ||
      !customerInfo.state ||
      !customerInfo.zipcode ||
      !customerInfo.country
    ) {
      setPaymentError("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setPaymentError("Card information is missing.");
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Create Payment Intent with your API first
      const products: { [key: string]: number } = {};
      cart.forEach((item) => {
        products[item.id.toString()] = item.quantity;
      });

      // Create payment intent through your own API route
      const paymentIntentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          customer_info: customerInfo,
          products: products,
        }),
      });

      if (!paymentIntentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await paymentIntentResponse.json();
      console.log("Payment Intent Created:", clientSecret);

      // Step 2: Confirm payment with Stripe
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone,
              address: {
                line1: customerInfo.address,
                city: customerInfo.city,
                state: customerInfo.state,
                postal_code: customerInfo.zipcode,
                country: customerInfo.country,
              },
            },
          },
        });

      if (confirmError) {
        setPaymentError(confirmError.message || "Payment failed.");
        setIsProcessing(false);
        return;
      }

      console.log("✅ Payment Confirmed:", paymentIntent);

      // Step 3: Payment successful! Now send confirmation to your API
      const payload = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zipcode: customerInfo.zipcode,
        country: customerInfo.country,
        total: parseFloat(total.toFixed(2)),
        products: products,
        payment_method: "stripe",
        payment_intent_id: paymentIntent.id,
        payment_status: "completed",
      };

      console.log("Sending order confirmation:", payload);

      // Send order confirmation to your external API
      const response = await fetch(
        "https://admin.bestfashionllc.com/api/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (result.status === "success") {
        // Payment already processed, just confirm order
        onPaymentSuccess({
          ...result,
          payment_intent_id: paymentIntent.id,
        });
      } else {
        setPaymentError(
          `Order confirmation failed: ${result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createPayPalOrder = (data: any, actions: any) => {
    console.log("🟡 Creating PayPal order for $", total.toFixed(2));
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toFixed(2),
            currency_code: "USD",
          },
          description: `Order for ${cart.length} items from ${customerInfo.name}`,
          custom_id: `order_${Date.now()}`,
          invoice_id: `inv_${Date.now()}`,
          soft_descriptor: "ECOMMERCE STORE",
        },
      ],
      application_context: {
        brand_name: "Your Ecommerce Store",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
      },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPayPalApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    setPaymentError(null);
    console.log("🟡 PayPal payment approved, capturing...");

    try {
      const order = await actions.order.capture();
      console.log("✅ PayPal Payment Captured Successfully:", order);

      // Verify payment status
      if ((order as { status: string }).status !== "COMPLETED") {
        throw new Error(
          `Payment not completed. Status: ${(order as { status: string }).status
          }`
        );
      }

      // Get payment details
      const paymentId = (order as { id: string }).id;
      const payerEmail = (order as { payer?: { email_address?: string } }).payer
        ?.email_address;
      const payerName =
        (
          order as {
            payer?: { name?: { given_name?: string; surname?: string } };
          }
        ).payer?.name?.given_name +
        " " +
        (
          order as {
            payer?: { name?: { given_name?: string; surname?: string } };
          }
        ).payer?.name?.surname;
      const transactionId = (
        order as {
          purchase_units?: Array<{
            payments?: { captures?: Array<{ id?: string }> };
          }>;
        }
      ).purchase_units?.[0]?.payments?.captures?.[0]?.id;

      // Prepare products object
      const products: { [key: string]: number } = {};
      cart.forEach((item) => {
        products[item.id.toString()] = item.quantity;
      });

      // Prepare payload for your API
      const payload = {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        shipping_address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zipcode: customerInfo.zipcode,
        country: customerInfo.country,
        total: parseFloat(total.toFixed(2)),
        products: products,
        payment_method: "paypal",
        payment_id: paymentId,
        payment_status: "completed",
        paypal_order_id: (order as { id: string }).id,
        paypal_transaction_id: transactionId,
        paypal_payer_email: payerEmail,
        paypal_payer_name: payerName,
        paypal_capture_id: transactionId,
      };

      console.log("📤 Sending PayPal order confirmation:", payload);

      // Send order confirmation to your external API
      const response = await fetch(
        "https://admin.bestfashionllc.com/api/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("📥 API Response:", result);

      if (result.status === "success") {
        console.log("🎉 PayPal payment completed successfully!");
        onPaymentSuccess({
          ...result,
          payment_id: paymentId,
          payment_method: "paypal",
          transaction_id: transactionId,
        });
      } else {
        throw new Error(result.message || "Order confirmation failed");
      }
    } catch (error) {
      console.error("❌ PayPal payment processing error:", error);
      setPaymentError(
        `PayPal payment failed: ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPayPalError = (err: any) => {
    console.error("❌ PayPal SDK error:", err);
    setPaymentError(
      "PayPal payment encountered an error. Please try again or use Credit Card."
    );
    setIsProcessing(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPayPalCancel = (data: any) => {
    console.log("⚠️ PayPal payment cancelled by user:", data);
    setPaymentError(
      "PayPal payment was cancelled. You can try again or use Credit Card."
    );
    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-blue-600 hover:text-blue-800 text-lg"
          type="button"
        >
          ← Back to Cart
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleStripeSubmit} className="space-y-6">
          <div className="text-red-600 text-sm font-medium">
            * Please enter your payment details to complete the transaction
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={customerInfo.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main St"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={customerInfo.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New York"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={customerInfo.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="NY"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                value={customerInfo.zipcode}
                onChange={(e) => handleInputChange("zipcode", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={customerInfo.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="PK">Pakistan</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
                <option value="AE">United Arab Emirates</option>
                <option value="SA">Saudi Arabia</option>
                <option value="BD">Bangladesh</option>
                <option value="EG">Egypt</option>
                <option value="TR">Turkey</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
                <option value="NL">Netherlands</option>
                <option value="SE">Sweden</option>
                <option value="NO">Norway</option>
                <option value="DK">Denmark</option>
                <option value="BE">Belgium</option>
                <option value="CH">Switzerland</option>
                <option value="AT">Austria</option>
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="CN">China</option>
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="TH">Thailand</option>
                <option value="PH">Philippines</option>
                <option value="ID">Indonesia</option>
                <option value="VN">Vietnam</option>
                <option value="BR">Brazil</option>
                <option value="MX">Mexico</option>
                <option value="AR">Argentina</option>
                <option value="CL">Chile</option>
                <option value="CO">Colombia</option>
                <option value="ZA">South Africa</option>
                <option value="NG">Nigeria</option>
                <option value="KE">Kenya</option>
                <option value="MA">Morocco</option>
                <option value="TN">Tunisia</option>
                <option value="DZ">Algeria</option>
                <option value="LY">Libya</option>
                <option value="IR">Iran</option>
                <option value="IQ">Iraq</option>
                <option value="AF">Afghanistan</option>
                <option value="RU">Russia</option>
                <option value="UA">Ukraine</option>
                <option value="PL">Poland</option>
                <option value="CZ">Czech Republic</option>
                <option value="HU">Hungary</option>
                <option value="RO">Romania</option>
                <option value="BG">Bulgaria</option>
                <option value="HR">Croatia</option>
                <option value="SI">Slovenia</option>
                <option value="SK">Slovakia</option>
                <option value="LT">Lithuania</option>
                <option value="LV">Latvia</option>
                <option value="EE">Estonia</option>
                <option value="FI">Finland</option>
                <option value="IE">Ireland</option>
                <option value="PT">Portugal</option>
                <option value="GR">Greece</option>
                <option value="MT">Malta</option>
                <option value="CY">Cyprus</option>
                <option value="IS">Iceland</option>
                <option value="LU">Luxembourg</option>
                <option value="LI">Liechtenstein</option>
                <option value="MC">Monaco</option>
                <option value="SM">San Marino</option>
                <option value="VA">Vatican City</option>
                <option value="AD">Andorra</option>
                <option value="NZ">New Zealand</option>
                <option value="FJ">Fiji</option>
                <option value="PG">Papua New Guinea</option>
                <option value="SB">Solomon Islands</option>
                <option value="VU">Vanuatu</option>
                <option value="NC">New Caledonia</option>
                <option value="PF">French Polynesia</option>
                <option value="WS">Samoa</option>
                <option value="TO">Tonga</option>
                <option value="KI">Kiribati</option>
                <option value="TV">Tuvalu</option>
                <option value="NR">Nauru</option>
                <option value="PW">Palau</option>
                <option value="FM">Micronesia</option>
                <option value="MH">Marshall Islands</option>
              </select>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "stripe"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
                onClick={() => setPaymentMethod("stripe")}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-gray-500">
                      Pay with your credit or debit card
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "paypal"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-gray-500">
                      Pay with your PayPal account
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Payment Form */}
          {paymentMethod === "stripe" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Card Information</h3>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="text-red-700 text-sm">{paymentError}</div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3">
                    <CardNumberElement
                      options={cardElementOptions}
                      onChange={(e) =>
                        setCardComplete((prev) => ({
                          ...prev,
                          number: e.complete,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3">
                      <CardExpiryElement
                        options={cardElementOptions}
                        onChange={(e) =>
                          setCardComplete((prev) => ({
                            ...prev,
                            expiry: e.complete,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3">
                      <CardCvcElement
                        options={cardElementOptions}
                        onChange={(e) =>
                          setCardComplete((prev) => ({
                            ...prev,
                            cvc: e.complete,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isProcessing ||
                  !cardComplete.number ||
                  !cardComplete.expiry ||
                  !cardComplete.cvc
                }
                className={`w-full mt-6 py-4 rounded-lg font-semibold text-lg transition ${isProcessing ||
                    !cardComplete.number ||
                    !cardComplete.expiry ||
                    !cardComplete.cvc
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
          )}

          {/* PayPal Payment */}
          {paymentMethod === "paypal" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">PayPal Payment</h3>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="text-red-700 text-sm">{paymentError}</div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600">
                  Click the PayPal button below to complete your payment
                  securely through PayPal.
                </div>
              </div>

              <PayPalButtons
                createOrder={createPayPalOrder}
                onApprove={onPayPalApprove}
                onError={onPayPalError}
                onCancel={onPayPalCancel}
                disabled={isProcessing}
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "rect",
                  label: "paypal",
                  height: 50,
                }}
              />
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🚚</span>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">↩️</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
const [shippingFee, setShippingFee] = useState<number>(0);

  const handleQuantityChange = (id: number, delta: number) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateQuantity(id, newQuantity);
    }
  };

  const handleQuantityInput = (id: number, value: string) => {
    const quantity = parseInt(value) || 1;
    updateQuantity(id, Math.max(1, quantity));
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
  };

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setAppliedCoupon("SAVE10");
      setCoupon("");
    } else {
      alert("Invalid coupon code");
    }
  };

  const handlePaymentSuccess = (data: PaymentSuccessData) => {
    console.log("✅ Payment & Order Success:", data);

    // Clear cart after successful payment
    cart.forEach((item) => removeFromCart(item.id));

    const paymentId =
      data.payment_intent_id || data.payment_id || data.transaction_id;
    const paymentMethod =
      data.payment_method === "paypal" ? "PayPal" : "Credit Card";
    const transactionId = data.transaction_id
      ? `\nTransaction ID: ${data.transaction_id}`
      : "";

    alert(
      `🎉 Payment Processed Successfully!\n\nOrder ID: ${data.order_id}\nPayment ID: ${paymentId}${transactionId}\nPayment Method: ${paymentMethod}\n\n✅ Your order has been confirmed and will be processed shortly!`
    );

    // Optional: Redirect to success URL if provided
    if (data.redirect_url) {
      window.location.href = "/";
    }
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
useEffect(() => {
  const fetchShippingFee = async () => {
    try {
      const response = await Fetch<{ data: ShippingSettings }>("shipping-settings");
      const cost = parseFloat(response.data.shipping_cost);
      setShippingFee(cost);
      console.log("✅ Shipping Fee Fetched:", cost);
    } catch (error) {
      console.error("❌ Failed to fetch shipping settings", error);
      setShippingFee(10); // fallback fee
    }
  };

  fetchShippingFee();
}, []);

  const shipping = subtotal > 100 ? 0 : shippingFee;
  const discount = appliedCoupon === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  // Empty cart state
  if (cart.length === 0 && !showPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">Add some items to get started!</p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0570de",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        spacingUnit: "2px",
        borderRadius: "4px",
      },
    },
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          {!showPayment ? (
            /* Cart View */
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">
                  Shopping Cart
                </h1>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Image
                          src={item.image || "/assets/images/placeholder.png"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {item.name}
                          </h3>
                          {item.attributes &&
                            Object.entries(item.attributes).map(([key, value]) => (
                              <p key={key}>
                                <strong>{key}:</strong> {value}
                              </p>
                            ))}

                          <div className="text-xl font-bold text-blue-600 mt-2">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityInput(item.id, e.target.value)
                              }
                              className="w-16 text-center border-0 focus:outline-none"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Coupon Code
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter coupon code (try SAVE10)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!appliedCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className={`px-6 py-3 rounded-lg font-medium transition ${appliedCoupon
                          ? "bg-green-100 text-green-700 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      disabled={!!appliedCoupon}
                    >
                      {appliedCoupon ? "✓ Applied" : "Apply"}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-3 text-green-600 text-sm font-medium">
                      🎉 Coupon &quot;{appliedCoupon}&quot; applied! You saved $
                      {discount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-96">
                <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Order Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Subtotal ({cart.length} items)
                      </span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium">
                        ${shipping.toFixed(2)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon})</span>
                        <span className="font-medium">
                          −${discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full mt-6 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition"
                  >
                    Proceed to Checkout
                  </button>
                  <div className="text-xs text-gray-500 text-center mt-3">
                    Free returns • Secure checkout
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Payment View */
            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                cart={cart}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                onPaymentSuccess={handlePaymentSuccess}
                onBack={() => setShowPayment(false)}
              />
            </Elements>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default CartPage;
