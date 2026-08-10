"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

import { Button } from "@/src/components/ui/button";

type DeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;

  loading?: boolean;

  title?: string;
  description?: string;

  itemName?: string;
};

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete item?",
  description = "This action cannot be undone.",
  itemName,
}: DeleteDialogProps) {
  const handleConfirm = async () => {
    if (loading) {
      return;
    }

    await onConfirm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !loading) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-105">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {itemName ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  "{itemName}"
                </span>
                ?
                <br />
                {description}
              </>
            ) : (
              description
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-5 sm:gap-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
