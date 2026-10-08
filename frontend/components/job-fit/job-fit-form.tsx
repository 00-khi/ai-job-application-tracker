"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";

import type { JobFitRequest, Strictness } from "@/lib/types";
import { strictnessLabels } from "@/lib/enum-labels";

interface JobFitFormProps {
  onGenerate: (request: JobFitRequest) => Promise<void>;
  loading: boolean;
}

export function JobFitForm({ onGenerate, loading }: JobFitFormProps) {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [strictness, setStrictness] = useState<Strictness>("BALANCED");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resume.trim() || !jobDescription.trim() || !strictness) return;

    await onGenerate({
      resume: resume.trim(),
      jobDescription: jobDescription.trim(),
      strictness: strictness as Strictness,
    });
  }

  const isDisabled =
    loading || !resume.trim() || !jobDescription.trim() || !strictness;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Resume &amp; Job Description</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Strictness</FieldLabel>
              <Select
                value={strictness}
                onValueChange={(val) => setStrictness(val as Strictness)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {strictness
                      ? strictnessLabels[strictness]
                      : "Select strictness level"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(strictnessLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                How harshly the AI scores your resume
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="jobFitResume">Resume</FieldLabel>
              <Textarea
                id="jobFitResume"
                placeholder="Paste your full resume text: experience, projects, skills, education"
                className="max-h-80 overflow-y-auto"
                rows={8}
                required
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
              <FieldDescription>
                Used to assess your experience, skills and impact
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="jobFitJobDescription">Job Description</FieldLabel>
              <Textarea
                id="jobFitJobDescription"
                placeholder="Paste the full job description you are applying for"
                className="max-h-80 overflow-y-auto"
                rows={8}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <FieldDescription>
                Requirements, responsibilities and must-have keywords
              </FieldDescription>
            </Field>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                disabled={isDisabled}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Analyze Fit"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
