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
import { Loader2Icon, XIcon } from "lucide-react";
import type { Seniority, BulletTone, BulletGenerationRequest } from "@/lib/types";
import { seniorityLabels, bulletToneLabels } from "@/lib/enum-labels";

interface BulletGeneratorFormProps {
  onGenerate: (request: BulletGenerationRequest) => Promise<void>;
  loading: boolean;
}

export function BulletGeneratorForm({ onGenerate, loading }: BulletGeneratorFormProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [seniority, setSeniority] = useState<Seniority | "">("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [achievements, setAchievements] = useState("");
  const [existingBullets, setExistingBullets] = useState("");
  const [tone, setTone] = useState<BulletTone | "">("");

  function handleSkillInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (trimmed && !skills.includes(trimmed)) {
        setSkills((prev) => [...prev, trimmed]);
      }
      setSkillInput("");
    }
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle.trim() || !seniority || !achievements.trim() || !tone || skills.length === 0) return;

    await onGenerate({
      jobTitle: jobTitle.trim(),
      seniority: seniority as Seniority,
      skills,
      achievements: achievements.trim(),
      existingBullets: existingBullets.trim() || undefined,
      tone: tone as BulletTone,
    });
  }

  const isDisabled = loading || !jobTitle.trim() || !seniority || !achievements.trim() || !tone || skills.length === 0;

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
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillInputKeyDown}
              />
              <FieldDescription>Press Enter to add each skill</FieldDescription>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="achievements">Key Achievements</FieldLabel>
              <Textarea
                id="achievements"
                placeholder="Describe your key achievements, e.g. 'Led team of 5, increased revenue by 30%'"
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
