"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { SignupFormErrors } from "@/src/app/types/loginType";
import { toast } from "./ui/toast";
import { Spinner } from "./ui/spinner";
import { SignUp } from "@/src/services/auth.service";

type SignUpFormProps = {
  setIsSignup: () => void;
};

export function SignUpForm({ setIsSignup }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { userName, email, password, confirmPassword } = formData;
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors: SignupFormErrors = {};

    if (userName.trim().length < 4 || userName.trim().length > 20) {
      newErrors.userName = "Username must be between 4 and 20 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      newErrors.email = "Invalid email address.";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    if (!validate()) {
      toast.add({
        type: "error",
        description: "Please fix the errors in the form.",
      });
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...payload } = formData;

      const res = await SignUp(payload);

      toast.add({
        type: "success",
        description: res.message || "Account has been created.",
      });

      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.add({
        type: "error",
        description: error.message || "Something went wrong.",
      });

      console.error("Signup error:", error);
    } finally {
      setLoading(false);
      setIsSignup();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            value={userName}
            onChange={(e) => handleChange("userName", e.target.value)}
            className={cn(
              "bg-background",
              errors.userName &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.userName && (
            <FieldDescription className="text-destructive">
              {errors.userName}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={cn(
              "bg-background",
              errors.email &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {errors.email && (
            <FieldDescription className="text-destructive">
              {errors.email}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={cn(
                "bg-background pr-10",
                errors.password &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <FieldDescription className="text-destructive">
              {errors.password}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={cn(
                "bg-background pr-10",
                errors.confirmPassword &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <FieldDescription className="text-destructive">
              {errors.confirmPassword}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button onClick={() => handleSubmit()} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-3">
                Creating Account... <Spinner />
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </Field>
        <FieldSeparator />
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsSignup()}
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
