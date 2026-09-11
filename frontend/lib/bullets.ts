import { apiFetch } from "@/lib/api";
import type {
  BulletGenerationRequest,
  BulletGenerationResponse,
} from "@/lib/types";

export async function generateBullets(
  request: BulletGenerationRequest,
): Promise<BulletGenerationResponse> {
  const response = await apiFetch("/api/ai/bullets", {
    method: "POST",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.message || `Failed to generate bullets (${response.status})`,
    );
  }

  return response.json();
}
