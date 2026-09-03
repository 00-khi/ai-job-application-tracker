"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [legalChecked, setLegalChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isFormValid = legalChecked && password === confirmPassword && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    // --- Email confirmation ON (uncomment below, comment out the block after it) ---
    // Also enable "Confirm email" in Supabase Dashboard > Auth > Providers > Email
    //
    // const { error: authError } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     emailRedirectTo: `${window.location.origin}/dashboard`,
    //   },
    // });
    //
    // if (authError) {
    //   setError(authError.message);
    //   setLoading(false);
    //   return;
    // }
    //
    // toast.success("Account created! Check your email for a confirmation link.");
    // setLoading(false);

    // --- Email confirmation OFF (current) ---
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Auto-login after signup so the user can use the app immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    toast.success("Account created!");
    router.push("/dashboard");
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldDescription>
                We will not share your email with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="legal"
                  checked={legalChecked}
                  onCheckedChange={(checked) =>
                    setLegalChecked(checked === true)
                  }
                />
                <FieldLabel
                  htmlFor="legal"
                  className="font-normal whitespace-nowrap flex-wrap leading-3"
                >
                  I have read the{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </Link>
                </FieldLabel>
              </div>
            </Field>
            {error && (
              <Field>
                <p className="text-sm text-destructive">{error}</p>
              </Field>
            )}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={!isFormValid || loading}>
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
