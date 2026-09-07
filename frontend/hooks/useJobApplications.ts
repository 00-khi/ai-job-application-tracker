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
import { isTimeoutError } from "@/lib/api-errors";

export function useJobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        setIsTimeout(false);
        const data = await fetchApplications();
        if (!cancelled) {
          setApplications(data);
        }
      } catch (err) {
        if (!cancelled) {
          if (isTimeoutError(err)) {
            setIsTimeout(true);
            setError(null);
          } else {
            setError(err instanceof Error ? err.message : "Failed to load applications");
          }
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
      setIsTimeout(false);
      const data = await fetchApplications();
      setApplications(data);
    } catch (err) {
      if (isTimeoutError(err)) {
        setIsTimeout(true);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : "Failed to load applications");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

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
    isTimeout,
    refetch,
    retry,
    create,
    update,
    remove,
  };
}
