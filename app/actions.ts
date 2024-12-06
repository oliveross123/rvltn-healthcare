"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { PostSchema, SiteCreationSchema, siteSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { requireUser } from "./utils/requireUser";
import { stripe } from "./utils/stripe";

const defaultProcedures = [
  { name: "Vstupní vyšetření", duration: 30 },
  { name: "Kontrola", duration: 20 },
  { name: "Očkování", duration: 10 },
  { name: "Konzultace", duration: 10 },
  { name: "Drápky, žlázky", duration: 15 },
  { name: "Zvracení, průjem", duration: 30 },
  { name: "Kašel, kýchání", duration: 30 },
  { name: "Stomatologická konzultace", duration: 30 },
  { name: "Kulhání", duration: 30 },
  { name: "Jiné", duration: 20 },
];

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
        userId: user.id,
      },
    }),
  ]);

  if (!subStatus || subStatus.status !== "active") {
    if (sites.length < 1) {
      // Allow creating a site
      const submission = await parseWithZod(formData, {
        schema: SiteCreationSchema({
          async isSubdirectoryUnique() {
            const exisitngSubDirectory = await prisma.site.findUnique({
              where: {
                subdirectory: formData.get("subdirectory") as string,
              },
            });
            return !exisitngSubDirectory;
          },
        }),
        async: true,
      });

      if (submission.status !== "success") {
        return submission.reply();
      }

      // Vytvoření stránky (Site)
      const site = await prisma.site.create({
        data: {
          description: submission.value.description,
          name: submission.value.name,
          subdirectory: submission.value.subdirectory,
          userId: user.id,
        },
      });

      // Přidání výchozích procedur
      await prisma.procedure.createMany({
        data: defaultProcedures.map((procedure) => ({
          name: procedure.name,
          duration: procedure.duration,
          clinicId: site.id,
        })),
      });

      return redirect("/dashboard/sites");
    } else {
      // user already has one site, don't allow
      return redirect("/dashboard/pricing");
    }
  } else if (subStatus.status === "active") {
    // User has an active plan, they can create sites...
    const submission = await parseWithZod(formData, {
      schema: SiteCreationSchema({
        async isSubdirectoryUnique() {
          const exisitngSubDirectory = await prisma.site.findUnique({
            where: {
              subdirectory: formData.get("subdirectory") as string,
            },
          });
          return !exisitngSubDirectory;
        },
      }),
      async: true,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    // Vytvoření stránky (Site)
    const site = await prisma.site.create({
      data: {
        description: submission.value.description,
        name: submission.value.name,
        subdirectory: submission.value.subdirectory,
        userId: user.id,
      },
    });

    // Přidání výchozích procedur
    await prisma.procedure.createMany({
      data: defaultProcedures.map((procedure) => ({
        name: procedure.name,
        duration: procedure.duration,
        clinicId: site.id,
      })),
    });

    return redirect("/dashboard/sites");
  }
}

export async function CreatePostAction(prevState: any, formData: FormData) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.post.create({
    data: {
      title: submission.value.title,
      smallDescription: submission.value.smallDescription,
      slug: submission.value.slug,
      articleContent: JSON.parse(submission.value.articleContent),
      image: submission.value.coverImage,
      userId: user.id,
      siteId: formData.get("siteId") as string,
    },
  });

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function EditPostActions(prevState: any, formData: FormData) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
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

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function DeletePost(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.post.delete({
    where: {
      userId: user.id,
      id: formData.get("articleId") as string,
    },
  });

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function UpdateImage(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.site.update({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
    data: {
      imageUrl: formData.get("imageUrl") as string,
    },
  });

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function DeleteSite(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.site.delete({
    where: {
      userId: user.id,
      id: formData.get("siteId") as string,
    },
  });

  return redirect("/dashboard/sites");
}

export async function CreateSubscription() {
  const user = await requireUser();

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
    billing_address_collection: "auto",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url:
      process.env.NODE_ENV === "production"
        ? "https://rvltn-healthcare.vercel.app/dashboard/payment/success"
        : "http://localhost:3000/dashboard/payment/success",
    cancel_url:
      process.env.NODE_ENV === "production"
        ? "https://rvltn-healthcare.vercel.app/dashboard/payment/cancelled"
        : "http://localhost:3000/dashboard/payment/cancelled",
  });

  return redirect(session.url as string);
}
