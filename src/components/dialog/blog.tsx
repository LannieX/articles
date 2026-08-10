"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { BlogsDataTableType } from "@/src/app/types/blogType";
import { ImagePlus, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";
import { CreateBlog, UpdateBlog } from "@/src/services/blog.service";
import { Spinner } from "../ui/spinner";

type BlogDataType = {
  id: string;
  image?: string | null;
  title: string;
  description: string;
};

type BlogDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  dialogType: "create" | "edit" | "";
  blog?: BlogDataType | null;
  onSuccess: () => void;
};

type FormData = {
  image: string;
  title: string;
  description: string;
};

const initialFormData: FormData = {
  image: "",
  title: "",
  description: "",
};

const BlogDialog = ({
  isOpen,
  onClose,
  dialogType,
  blog,
  onSuccess,
}: BlogDialogProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [loadingCreateBlog, setLoadingCreateBlog] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = dialogType === "edit";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isEdit && blog) {
      setFormData({
        image: blog.image ?? "",
        title: blog.title ?? "",
        description: blog.description ?? "",
      });

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFormData(initialFormData);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [isOpen, isEdit, blog]);

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (loadingCreateBlog) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: previewUrl,
    }));
  };

  const handleRemoveImage = () => {
    if (formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }

    setFormData((prev) => ({
      ...prev,
      image: "",
    }));

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      throw new Error("Cloudinary cloud name is missing");
    }

    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("upload_preset", "pos_product_preset");

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const response = await fetch(url, {
      method: "POST",
      body: uploadData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Upload failed");
    }

    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.add({
        type: "error",
        description: "Please enter blog title.",
      });

      return;
    }

    if (!formData.description.trim()) {
      toast.add({
        type: "error",
        description: "Please enter blog description.",
      });

      return;
    }

    setLoadingCreateBlog(true);

    try {
      let finalImageUrl = formData.image;

      if (selectedFile) {
        finalImageUrl = await uploadImageToCloudinary(selectedFile);
      }

      const body = {
        image: finalImageUrl || "",
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      let res;

      if (dialogType === "create") {
        res = await CreateBlog(body);
      } else if (dialogType === "edit" && blog?.id) {
        res = await UpdateBlog(blog.id, body);
      } else {
        throw new Error("Invalid blog action");
      }

      toast.add({
        type: "success",
        description:
          res?.items?.message ??
          (isEdit ? "Blog updated successfully" : "Blog created successfully"),
      });

      resetForm();

      onSuccess();
      onClose();
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while saving the blog.",
      });
    } finally {
      setLoadingCreateBlog(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Blog" : "Create Blog"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Image</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex justify-center">
            {formData.image ? (
              <div className="group relative h-40 w-40">
                <img
                  src={formData.image}
                  alt="Blog preview"
                  className="h-40 w-40 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="
            absolute
            right-1
            top-1
            rounded-full
            bg-red-500
            p-1
            text-white
            opacity-0
            transition-opacity
            group-hover:opacity-100
          "
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
          flex
          h-40
          w-40
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-lg
          border-2
          border-dashed
          text-gray-400
          transition-colors
          hover:border-black
          hover:bg-gray-50
          hover:text-black
        "
              >
                <ImagePlus className="mb-2 h-8 w-8" />

                <span className="text-sm">Select Image</span>
              </button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="Blog title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Blog description"
            className="min-h-32"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loadingCreateBlog}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loadingCreateBlog}
          >
            {loadingCreateBlog ? (
              <div className="flex items-center gap-2">
                {isEdit ? "Updating..." : "Creating..."}
                <Spinner />
              </div>
            ) : isEdit ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDialog;
