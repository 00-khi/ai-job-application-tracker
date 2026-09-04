"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  type JobApplication,
  type CreateApplicationInput,
} from "@/lib/job-applications";

export function useJobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchApplications();
        if (!cancelled) {
          setApplications(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load applications");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (input: CreateApplicationInput) => {
      const newApp = await createApplication(input);
      setApplications((prev) => [newApp, ...prev]);
      return newApp;
    },
    [],
  );

  const update = useCallback(
    async (id: string, input: CreateApplicationInput) => {
      const updated = await updateApplication(id, input);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app)),
      );
      return updated;
    },
    [],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    },
    [],
  );

  return {
    applications,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
  };
}
