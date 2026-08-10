"use client";

import { useState } from "react";
import { Pencil, Trash2, User, X, Check } from "lucide-react";
import { useSession } from "next-auth/react";

import { DeleteDialog } from "@/src/components/dialog/delete";
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";

import {
  CreateComment,
  UpdateComment,
  DeleteComment,
} from "@/src/services/comment.service";

type CommentUser = {
  id: string;
  userName: string;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  articleId: string;
  userId: string;
  user: CommentUser;
};

type CommentSectionProps = {
  articleId: string;
  initialComments: Comment[];
};

export function CommentSection({
  articleId,
  initialComments,
}: CommentSectionProps) {
  const { data: session, status } = useSession();

  const [comments, setComments] = useState<Comment[]>(initialComments);

  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editingContent, setEditingContent] = useState("");

  const [loadingCommentId, setLoadingCommentId] = useState<string | null>(null);

  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = session?.user?.id;

  const handleCreate = async () => {
    const value = content.trim();

    if (!value || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await CreateComment(articleId, value);

      const newComment = res?.items?.comment ?? res?.comment;

      if (newComment) {
        setComments((prev) => [...prev, newComment]);
      }

      setContent("");
    } catch (error) {
      console.error("Create comment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStart = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const handleUpdate = async (commentId: string) => {
    const value = editingContent.trim();

    if (!value || loadingCommentId) {
      return;
    }

    try {
      setLoadingCommentId(commentId);

      const res = await UpdateComment(commentId, value);

      const updatedComment = res?.items?.comment ?? res?.comment;

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content: updatedComment?.content ?? value,
                updatedAt:
                  updatedComment?.updatedAt ?? new Date().toISOString(),
              }
            : comment,
        ),
      );

      handleEditCancel();
    } catch (error) {
      console.error("Update comment error:", error);
    } finally {
      setLoadingCommentId(null);
    }
  };

  const handleDeleteClick = (commentId: string) => {
    setDeleteCommentId(commentId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCommentId || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);

      await DeleteComment(deleteCommentId);
      setComments((prev) =>
        prev.filter((comment) => comment.id !== deleteCommentId),
      );

      setDeleteCommentId(null);
    } catch (error) {
      console.error("Delete comment error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
      {comments.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No comments yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {comments.map((comment) => {
            const isOwner = currentUserId === comment.userId;

            const isEditing = editingId === comment.id;

            const isLoading = loadingCommentId === comment.id;

            return (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <User size={16} className="shrink-0" />
                      <span className="font-medium">
                        {comment.user?.userName ?? "-"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    {isEditing ? (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          disabled={isLoading}
                          className="min-h-24"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleUpdate(comment.id)}
                            disabled={isLoading || !editingContent.trim()}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={handleEditCancel}
                            disabled={isLoading}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {comment.content}
                      </p>
                    )}
                  </div>
                  {isOwner && !isEditing && (
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditStart(comment)}
                        disabled={isLoading}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(comment.id)}
                        disabled={isLoading}
                        className="text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {status === "authenticated" ? (
        <div className="mt-8 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-32"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            onClick={handleCreate}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      ) : status === "loading" ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading...</p>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          Please login to comment.
        </p>
      )}
      <DeleteDialog
        open={deleteCommentId !== null}
        onClose={() => setDeleteCommentId(null)}
        loading={isDeleting}
        title="Delete comment?"
        description="This comment will be permanently deleted."
        onConfirm={handleDeleteConfirm}
      />
    </section>
  );
}
