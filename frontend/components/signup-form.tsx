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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [legalChecked, setLegalChecked] = useState(false);

  const isFormValid = legalChecked;

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We will not share your email with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" required />
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
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={!isFormValid}>
                  Create Account
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
