"use client";


import { LoginForm } from "@/src/components/login-form";
import { SignUpForm } from "@/src/components/signup-form";
import { useState } from "react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState<boolean>(false);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/bg2.jpg"
          alt="Image"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isSignup ? (
              <SignUpForm setIsSignup={() => setIsSignup(false)} />
            ) : (
              <LoginForm setIsSignup={() => setIsSignup(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}