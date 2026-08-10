"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { formatDate } from "@/src/lib/utils";

import { BookMark, UnBookMark } from "@/src/services/bookmark.service";

import { DeleteBlog } from "@/src/services/blog.service";

import { DeleteDialog } from "@/src/components/dialog/delete";
import BlogDialog from "@/src/components/dialog/blog";

type BlogsAuthor = {
  id: string;
  userName: string;
};

type BlogCardProps = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  author: BlogsAuthor;
  createdAt: string;

  currentUserId?: string;
  currentUserRole?: "ADMIN" | "USER";

  isBookmarked?: boolean;

  onUpdated?: () => void;
  onDeleted?: (id: string) => void;
};

export function BlogCard({
  id,
  title,
  description,
  image,
  author,
  createdAt,
  currentUserId,
  currentUserRole,
  isBookmarked: initialIsBookmarked = false,
  onUpdated,
  onDeleted,
}: BlogCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isOwner = currentUserId === author.id;
  const isAdmin = currentUserRole === "ADMIN";

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  const handleBookmark = async () => {
    if (isBookmarkLoading) {
      return;
    }

    const previousState = isBookmarked;

    setIsBookmarked(!previousState);
    setIsBookmarkLoading(true);

    try {
      if (previousState) {
        await UnBookMark(id);
      } else {
        await BookMark(id);
      }
    } catch (error) {
      console.error("Bookmark error:", error);

      setIsBookmarked(previousState);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);

    await onUpdated?.();
  };

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      await DeleteBlog(id);

      setIsDeleteDialogOpen(false);

      onDeleted?.(id);
    } catch (error) {
      console.error("Delete blog error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="group flex h-full flex-col p-0 overflow-hidden">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden">
          <Link href={`/blogs/${id}`} className="block h-full w-full">
            <Image
              src={
                image ||
                "https://res.cloudinary.com/dyc6epcdk/image/upload/v1785835502/not-available_amhcng.png"
              }
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="
                object-cover
                transition-transform
                duration-500
                ease-out
                group-hover:scale-105
              "
            />
          </Link>
          <button
            type="button"
            disabled={isBookmarkLoading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleBookmark();
            }}
            className="
              absolute
              right-3
              top-3
              rounded-full
              bg-background/80
              p-2
              backdrop-blur
              transition-all
              duration-300
              hover:scale-110
              hover:bg-background
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-green-500" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>
        <CardContent className="flex min-h-50 flex-1 flex-col p-5">
          <Link href={`/blogs/${id}`} className="block">
            <h2 className="line-clamp-1 text-[18px] font-semibold">{title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          </Link>
          <div className="mt-auto flex items-start justify-between gap-2 border-t pt-4">
            <div className="flex min-w-0 flex-col items-start gap-1 text-sm text-muted-foreground">
              <div className="flex min-w-0 items-center gap-2">
                <User size={16} className="shrink-0" />
                <span className="max-w-25 truncate">
                  {author?.userName ?? "-"}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
            {(canEdit || canDelete) && (
              <div className="flex shrink-0 items-center gap-1">
                {canEdit && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      handleEdit();
                    }}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {canDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setIsDeleteDialogOpen(true);
                    }}
                    disabled={isDeleting}
                    className="text-destructive hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <BlogDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        dialogType="edit"
        blog={{
          id,
          title,
          description,
          image: image ?? null,
        }}
        onSuccess={handleEditSuccess}
      />
      <DeleteDialog
        open={isDeleteDialogOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(false);
          }
        }}
        loading={isDeleting}
        title="Delete blog?"
        description="This blog will be permanently deleted."
        itemName={title}
        onConfirm={handleDelete}
      />
    </>
  );
}
