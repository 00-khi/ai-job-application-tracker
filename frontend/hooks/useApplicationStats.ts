import { useMemo } from "react";
import { getApplicationStats } from "@/data/mock-data";

export function useApplicationStats() {
  return useMemo(() => getApplicationStats(), []);
}
