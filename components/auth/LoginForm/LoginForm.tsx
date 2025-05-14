'use client';

import { cn } from "@/lib/utils/cn"; // Ensure this path is correct as per your alias
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { login, isLoading } = useAuth();

  const handleGoogleLogin = () => {
    if (!isLoading) {
      login();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center"> {/* Centering header text */}
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>
            Sign in or create an account with Google to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoading ? "Redirecting..." : "Sign in with Google"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}