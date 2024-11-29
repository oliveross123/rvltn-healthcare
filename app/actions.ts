"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { PostSchema, SiteCreationSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { requireUser } from "./utils/requireUser";
import { stripe } from "./utils/stripe";
import { create } from "domain";

// Helper function to validate the existence of a user
async function validateUser(userId: string) {
  try {
    console.log("Validating user existence:", userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      console.error("User does not exist:", userId);
      throw new Error("User does not exist.");
    }
    console.log("User validated successfully:", userId);
  } catch (error) {
    console.error("Error validating user:", error);
    throw error;
  }
}

export async function CreateSiteAction(prevState: any, formData: FormData) {
  const user = await requireUser();
  const [subStatus, sites] = await Promise.all([
    prisma.subscription.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        status: true,
      },
    }),
    prisma.site.findMany({
      where: {
        userId: user.id, // Poté co se zkontroluje, že uživatel má subscrpition, tak poté stejně hledáme stránky které odpovídají pouze jemu user.id
      },
    }),
  ]);

  console.log("Creating site for user:", user.id);

  if (!subStatus || subStatus.status !== "active") {
    if (sites.length < 1) {
      //Allow creating a site
      await createSite(); // musí být před funcki await, protože samotná funkce má "Async" a jinak by se nevykonala
    } else {
      //TODO:PŘEDĚLAT PODLE POZNÁMKY - momentálně to funguje tak že bez suba můžeš mít jednu stránku, potřebujeme to změnit
      // User already has one site dont allow
      return redirect("/dashboard/pricing");
    }
  } else if (subStatus.status === "active") {
    //TODO:PŘEDĚLAT PODLE POZNÁMKY
    // User has an active subscription but page limit is still 1
    await createSite(); // musí být před funcki await, protože samotná funkce má "Async" a jinak by se nevykonala
  }
  // Validate if the user exists
  await validateUser(user.id);

  async function createSite() {
    const submission = await parseWithZod(formData, {
      schema: SiteCreationSchema({
        async isSubdirectoryUnique() {
          console.log("Checking if subdirectory is unique");
          const existingSubDirectory = await prisma.site.findUnique({
            where: {
              subdirectory: formData.get("subdirectory") as string,
            },
          });
          return !existingSubDirectory;
        },
      }),
      async: true,
    });

    if (submission.status !== "success") {
      console.warn("Submission validation failed:", submission);
      return submission.reply();
    }

    const response = await prisma.site.create({
      data: {
        description: submission.value.description,
        name: submission.value.name,
        subdirectory: submission.value.subdirectory,
        userId: user.id, // Ensure this matches the existing user ID
      },
    });
  } //redirect se musí nechat mimo async funkci aby fungoval
  return redirect("/dashboard/sites");
}

export async function CreatePostAction(prevState: any, formData: FormData) {
  try {
    const user = await requireUser();
    console.log("Creating post for user:", user.id);

    // Validate if the user exists
    await validateUser(user.id);

    const siteId = formData.get("siteId") as string;
    console.log("Validating site existence:", siteId);

    // Validate if the site exists
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      console.error("Site does not exist:", siteId);
      throw new Error("Site does not exist.");
    }

    const submission = parseWithZod(formData, {
      schema: PostSchema,
    });

    if (submission.status !== "success") {
      console.warn("Submission validation failed:", submission);
      return submission.reply();
    }

    const data = await prisma.post.create({
      data: {
        title: submission.value.title,
        slug: submission.value.slug,
        image: submission.value.coverImage,
        smallDescription: submission.value.smallDescription,
        articleContent: JSON.parse(submission.value.articleContent),
        userId: user.id,
        siteId: site.id, // Make sure this matches an existing site ID
      },
    });

    console.log("Post created successfully:", data);
    return redirect(`/dashboard/sites/${siteId}`);
  } catch (error) {
    console.error("Error in CreatePostAction:", error);
    throw error;
  }
}

// Repeat the pattern of logging and error handling for other functions

export async function EditPostActions(prevState: any, formData: FormData) {
  try {
    const user = await requireUser();
    console.log("Editing post for user:", user.id);

    const submission = parseWithZod(formData, {
      schema: PostSchema,
    });

    if (submission.status !== "success") {
      console.warn("Submission validation failed:", submission);
      return submission.reply();
    }

    const data = await prisma.post.update({
      where: {
        userId: user.id,
        id: formData.get("articleId") as string,
      },
      data: {
        title: submission.value.title,
        smallDescription: submission.value.smallDescription,
        slug: submission.value.slug,
        articleContent: JSON.parse(submission.value.articleContent),
        image: submission.value.coverImage,
      },
    });

    console.log("Post updated successfully:", data);
    return redirect(`/dashboard/sites/${formData.get("siteId")}`);
  } catch (error) {
    console.error("Error in EditPostActions:", error);
    throw error;
  }
}

export async function DeletePost(formData: FormData) {
  try {
    const user = await requireUser();
    console.log("Deleting post for user:", user.id);

    const data = await prisma.post.delete({
      where: {
        userId: user.id,
        id: formData.get("articleId") as string,
      },
    });

    console.log("Post deleted successfully:", data);
    return redirect(`/dashboard/sites/${formData.get("siteId")}`);
  } catch (error) {
    console.error("Error in DeletePost:", error);
    throw error;
  }
}

export async function UpdateImage(formData: FormData) {
  try {
    const user = await requireUser();
    console.log("Updating site image for user:", user.id);

    const data = await prisma.site.update({
      where: {
        userId: user.id,
        id: formData.get("siteId") as string,
      },
      data: {
        imageUrl: formData.get("imageUrl") as string,
      },
    });

    console.log("Image updated successfully:", data);
    return redirect(`/dashboard/sites/${formData.get("siteId")}`);
  } catch (error) {
    console.error("Error in UpdateImage:", error);
    throw error;
  }
}

export async function DeleteSite(formData: FormData) {
  try {
    const user = await requireUser();
    console.log("Deleting site for user:", user.id);

    const data = await prisma.site.delete({
      where: {
        userId: user.id,
        id: formData.get("siteId") as string,
      },
    });

    console.log("Site deleted successfully:", data);
    return redirect(`/dashboard/sites`);
  } catch (error) {
    console.error("Error in DeleteSite:", error);
    throw error;
  }
}

export async function CreateSubscription() {
  const user = await requireUser();

  // Your subscription logic here
  let stripeUserId = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      customerId: true,
      email: true,
      firstName: true,
    },
  });

  if (!stripeUserId?.customerId) {
    const stripeCustomer = await stripe.customers.create({
      email: stripeUserId?.email,
      name: stripeUserId?.firstName,
    });

    stripeUserId = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        customerId: stripeCustomer.id,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeUserId.customerId as string,
    mode: "subscription",
    payment_method_types: ["card"],
    billing_address_collection: "auto",
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url: "http://localhost:3000/dashboard/payment/success",
    cancel_url: "http://localhost:3000/dashboard/payment/cancelled",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
  });

  return redirect(session.url as string);
}
