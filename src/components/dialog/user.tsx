"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { User } from "@/src/app/types/userType";
import { Switch } from "../ui/switch";
import { UpdateUser } from "@/src/services/user.service";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "view" | "edit";
  user: User | null;
  onSuccess?: () => void;
}

type UserFormData = {
  userName: string;
  email: string;
  isActive: boolean;
};

const initialFormData: UserFormData = {
  userName: "",
  email: "",
  isActive: false,
};

const UserDialog = ({
  isOpen,
  onClose,
  type,
  user,
  onSuccess,
}: UserDialogProps) => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName ?? "",
        email: user.email ?? "",
        isActive: user.isActive ?? false,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [user, isOpen]);

  const updateField = <K extends keyof UserFormData>(
    key: K,
    value: UserFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      return;
    }

    if (!formData.userName.trim()) {
      toast.add({
        type: "error",
        description: "Username is required.",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast.add({
        type: "error",
        description: "Email is required.",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await UpdateUser(user.id, {
        userName: formData.userName.trim(),
        email: formData.email.trim(),
        isActive: formData.isActive,
      });

      toast.add({
        type: "success",
        description: res?.items?.message ?? "User updated successfully.",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Update user error:", error);

      toast.add({
        type: "error",
        description:
          error instanceof Error ? error.message : "Failed to update user.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "view" ? "View User" : "Edit User"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              value={formData.userName}
              disabled={type === "view" || loading}
              onChange={(e) => updateField("userName", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled={type === "view" || loading}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="active"
              disabled={type === "view" || loading}
              checked={formData.isActive}
              onCheckedChange={(checked) => updateField("isActive", checked)}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>
        {type === "edit" && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  Saving...
                  <Spinner />
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
