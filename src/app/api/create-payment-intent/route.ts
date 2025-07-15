import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(
  "sk_test_51Pgm6hG8wbSCZBNDTf9LXKlAReWjFyJBdkW90dEBDQQxFbhpe0quBhg0PTDscYbm30ArCQnrjI3sePqpWdfK3w5C001KBZUYIA"
);

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const { amount, customer_info, products } = await req.json();

    console.log("Creating payment intent for amount:", amount);
    console.log("Customer info:", customer_info);
    console.log("Products:", products);

    // Create a PaymentIntent with the given amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure integer
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        customer_name: customer_info.name,
        customer_email: customer_info.email,
        customer_phone: customer_info.phone,
        products: JSON.stringify(products),
      },
    });

    console.log("Payment intent created:", paymentIntent.id);

    // Return the client secret to the frontend
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error creating payment intent:", error);

    if (error instanceof Error && error.message) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ error: "An unknown error occurred" }),
      { status: 500 }
    );
  }
}
