import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { GetBlogOne } from "@/src/services/blog.service";
import { CommentSection } from "@/src/components/comment-section";

type BlogDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { id } = await params;

  const res = await GetBlogOne(id);

  const blog = res.items;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/blogs"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <article>
        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={
              blog.image ||
              "https://res.cloudinary.com/dyc6epcdk/image/upload/v1785835502/not-available_amhcng.png"
            }
            alt={blog.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold md:text-4xl">{blog.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>{blog.author?.userName ?? "-"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} />

            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-lg text-muted-foreground">{blog.description}</p>
        </div>
      </article>

      <CommentSection
        articleId={blog.id}
        initialComments={blog.comments ?? []}
      />
    </div>
  );
}
