"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { toast } from "./ui/toast";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type LoginFormProps = {
  setIsSignup: () => void;
};

type LoginFormErrors = {
  email?: string;
  password?: string;
};

export function LoginForm({ setIsSignup }: LoginFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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
    const validationErrors: LoginFormErrors = {};

    if (!email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email address.";
    }

    if (!password) {
      validationErrors.password = "Password is required.";
    } else if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        toast.add({
          type: "error",
          description: result?.error ?? "Invalid email or password",
        });

        return;
      }

      toast.add({
        type: "success",
        description: "Login successfully",
      });

      router.push("/blogs");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      toast.add({
        type: "error",
        description: "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FieldGroup>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Login to your account</h1>

        <p className="text-sm text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>

        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="m@example.com"
          disabled={loading}
          className={cn(
            errors.email && "border-destructive focus-visible:ring-destructive",
          )}
        />

        {errors.email && (
          <FieldDescription className="text-destructive">
            {errors.email}
          </FieldDescription>
        )}
      </Field>

      <Field>
        <div className="flex items-center">
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <button
            type="button"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </button>
        </div>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={loading}
            className={cn(
              "pr-10",
              errors.password &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
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
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              Signing in...
              <Spinner />
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </Field>

      <FieldSeparator />

      <Field>
        <FieldDescription className="text-center">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={setIsSignup}
            className="cursor-pointer underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </button>
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
