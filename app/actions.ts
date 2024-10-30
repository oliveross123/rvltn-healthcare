"use server";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { PostSchema, SiteCreationSchema, siteSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { requireUser } from "./utils/requireUser";

// Helper function to validate the existence of a user
async function validateUser(userId: string) {
  const user = await prisma.clinic.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("User does not exist.");
  }
}

export async function CreateSiteAction(prevState: any, formData: FormData) {
  const user = await requireUser();

  // Validate if the user exists
  await validateUser(user.id);

  const submission = await parseWithZod(formData, {
    schema: SiteCreationSchema({
      async isSubdirectoryUnique() {
        const exisitingSubDirectory = await prisma.site.findUnique({
          where: {
            subdirectory: formData.get("subdirectory") as string,
          },
        });
        return !exisitingSubDirectory;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const response = await prisma.site.create({
    data: {
      description: submission.value.description,
      name: submission.value.name,
      subdirectory: submission.value.subdirectory,
      clinicId: user.id, // Ensure this matches the existing user ID
    },
  });

  return redirect("/dashboard/sites");
}

export async function CreatePostAction(prevState: any, formData: FormData) {
  const user = await requireUser();

  // Validate if the user exists
  await validateUser(user.id);

  const siteId = formData.get("siteId") as string;

  // Validate if the site exists
  const site = await prisma.site.findUnique({
    where: { id: siteId },
  });

  if (!site) {
    throw new Error("Site does not exist.");
  }

  const submission = parseWithZod(formData, {
    schema: PostSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.post.create({
    data: {
      title: submission.value.title,
      slug: submission.value.slug,
      image: submission.value.coverImage,
      smallDescription: submission.value.smallDescription,
      articleContent: JSON.parse(submission.value.articleContent),
      clinicId: user.id,
      siteId: site.id, // Make sure this matches an existing site ID
    },
  });

  return redirect(`/dashboard/sites/${siteId}`);
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
      clinicId: user.id,
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
      clinicId: user.id,
      id: formData.get("articleId") as string,
    },
  });

  return redirect(`/dashboard/sites/${formData.get("siteId")}`);
}

export async function UpadteImage(formData: FormData) {
  const user = await requireUser();

  const data = await prisma.site.update({
    where: {
      clinicId: user.id,
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
      clinicId: user.id,
      id: formData.get("siteId") as string,
    },
  });

  return redirect(`/dashboard/sites`);
}
