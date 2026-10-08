"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import type { Seniority, BulletTone, BulletGenerationRequest } from "@/lib/types";
import { seniorityLabels, bulletToneLabels } from "@/lib/enum-labels";

interface BulletGeneratorFormProps {
  onGenerate: (request: BulletGenerationRequest) => Promise<void>;
  loading: boolean;
}

export function BulletGeneratorForm({ onGenerate, loading }: BulletGeneratorFormProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [seniority, setSeniority] = useState<Seniority | "">("");
  const [skillsText, setSkillsText] = useState("");
  const [achievements, setAchievements] = useState("");
  const [existingBullets, setExistingBullets] = useState("");
  const [tone, setTone] = useState<BulletTone | "">("");

  const parsedSkills = skillsText.split(",").map((s) => s.trim()).filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle.trim() || !seniority || !achievements.trim() || !tone || parsedSkills.length === 0) return;

    await onGenerate({
      jobTitle: jobTitle.trim(),
      seniority: seniority as Seniority,
      skills: parsedSkills,
      achievements: achievements.trim(),
      existingBullets: existingBullets.trim() || undefined,
      tone: tone as BulletTone,
    });
  }

  const isDisabled = loading || !jobTitle.trim() || !seniority || !achievements.trim() || !tone || parsedSkills.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Your Bullets</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
              <Input
                id="jobTitle"
                placeholder="e.g. Senior Backend Developer"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Seniority</FieldLabel>
                <Select
                  value={seniority}
                  onValueChange={(val) => setSeniority(val as Seniority | "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {seniority ? seniorityLabels[seniority as Seniority] : "Select seniority level"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(seniorityLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Tone</FieldLabel>
                <Select
                  value={tone}
                  onValueChange={(val) => setTone(val as BulletTone | "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {tone ? bulletToneLabels[tone as BulletTone] : "Select tone style"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(bulletToneLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="skills">Skills</FieldLabel>
              <Input
                id="skills"
                placeholder="Comma-separated, e.g. react, typescript"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
              />
              <FieldDescription>Separate skills with commas</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="achievements">Key Achievements</FieldLabel>
              <Textarea
                id="achievements"
                placeholder="Describe your key achievements, e.g. 'Led team of 5, increased revenue by 30%'"
                className="max-h-80 overflow-y-auto"
                rows={3}
                required
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="existingBullets">Existing Bullets</FieldLabel>
              <Textarea
                id="existingBullets"
                placeholder="Optional: paste existing bullets to improve them"
                className="max-h-80 overflow-y-auto"
                rows={3}
                value={existingBullets}
                onChange={(e) => setExistingBullets(e.target.value)}
              />
            </Field>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="submit" disabled={isDisabled} className="w-full sm:w-auto">
                {loading ? <Loader2Icon className="animate-spin" /> : "Generate Bullets"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
