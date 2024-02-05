import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import NextResponse from "next/server";
import { metadata } from './../app/layout';
const return_url = process.env.NEXT_BASE_URL + '/'

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    const userSubscriptions = await db.select().from('userSubscriptions').where(eq(userSubscriptions[0].stripeCustomerId));

    if (userSubscriptions[0] && userSubscriptions[0].stripeCustomerId) {
      try {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: userSubscriptions[0].stripeCustomerId,
          return_url: return_url, // provide a URL to redirect to after the session
        });
        return NextResponse.json({ url: stripeSession.url });
      } catch (error) {
        // handle error
      }
    } else {
      // user's first time trying to subscribe
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: return_url,
          cancel_url: return_url,
          payment_method_types: ['card'],
          mode: 'subscription',
          billing_address_collection: 'auto',
          customer_email: user?.emailAddresses[0].emailAddress,
          line_items: [
            {
              price_data: {
                currency: 'USD',
                product_data: {
                  name: 'Chat PDF Pro',
                  description: 'Unlimited PDF sessions!',
                },
                unit_amount: 2000,
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
          metadata: {
            userId
          }
        });
        return NextResponse.json({ url: stripeSession.url });
      } catch (error) {
        console.error("General Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
        
        // handle error
      }
    }
  } catch (error) {
    // handle error
  }
}