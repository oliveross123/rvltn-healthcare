import prisma from "@/app/utils/db";
import { headers } from "next/headers";
import { stripe } from "@/app/utils/stripe";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    console.error("Error verifying webhook:", error);
    return new Response("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // 1. Handling `checkout.session.completed`
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const customerId = session.customer as string;

    const user = await prisma.user.findUnique({
      where: {
        customerId: customerId,
      },
    });

    if (!user) {
      console.error("User not found for customerId:", customerId);
      return new Response("User not found", { status: 404 });
    }

    try {
      await prisma.subscription.create({
        data: {
          stripeSubscriptionId: subscription.id,
          userId: user.id,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          status: subscription.status,
          planId: subscription.items.data[0].plan.id,
          interval: String(subscription.items.data[0].plan.interval),
        },
      });
      console.log("Subscription created for user:", user.id);
    } catch (error) {
      console.error("Error creating subscription:", error);
      return new Response("Error creating subscription", { status: 500 });
    }
  }

  // 2. Handling `invoice.payment_succeeded`
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        stripeSubscriptionId: subscription.id,
      },
    });

    if (existingSubscription) {
      // Update existing subscription
      try {
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            planId: subscription.items.data[0].price.id,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            status: subscription.status,
          },
        });
        console.log(
          "Subscription updated for stripeSubscriptionId:",
          subscription.id
        );
      } catch (error) {
        console.error("Error updating subscription:", error);
        return new Response("Error updating subscription", { status: 500 });
      }
    } else {
      // Create a new subscription if it doesn't exist
      const customerId = session.customer as string;

      const user = await prisma.user.findUnique({
        where: {
          customerId: customerId,
        },
      });

      if (!user) {
        console.error("User not found for customerId:", customerId);
        return new Response("User not found", { status: 404 });
      }

      try {
        await prisma.subscription.create({
          data: {
            stripeSubscriptionId: subscription.id,
            userId: user.id,
            currentPeriodStart: subscription.current_period_start,
            currentPeriodEnd: subscription.current_period_end,
            status: subscription.status,
            planId: subscription.items.data[0].price.id,
            interval: String(subscription.items.data[0].plan.interval),
          },
        });
        console.log(
          "Subscription created during invoice.payment_succeeded for user:",
          user.id
        );
      } catch (error) {
        console.error(
          "Error creating subscription during invoice.payment_succeeded:",
          error
        );
        return new Response("Error creating subscription", { status: 500 });
      }
    }
  }

  return new Response(null, { status: 200 });
}
