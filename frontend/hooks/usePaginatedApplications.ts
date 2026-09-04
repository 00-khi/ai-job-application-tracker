"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchApplicationsPaginated,
  fetchApplicationStats,
  createApplication,
  updateApplication,
  deleteApplication,
  type JobApplication,
  type CreateApplicationInput,
} from "@/lib/job-applications";
import type { PaginatedResponse, SearchParams, ApplicationStats } from "@/lib/types";

export function usePaginatedApplications() {
  const [data, setData] = useState<PaginatedResponse<JobApplication>>({
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const debouncedSearch = useRef(search);

  const fetchData = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchApplicationsPaginated(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await fetchApplicationStats();
      setStats(result);
    } catch {
      // Stats are non-critical, fail silently
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const params: SearchParams = {
      page,
      size: pageSize,
      search: debouncedSearch.current,
      status,
      sortBy,
      sortDirection,
    };

    if (!cancelled) {
      fetchData(params);
      fetchStats();
    }

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, status, sortBy, sortDirection, fetchData, fetchStats]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        debouncedSearch.current = value;
        setPage(0);
        const params: SearchParams = {
          page: 0,
          size: pageSize,
          search: value,
          status,
          sortBy,
          sortDirection,
        };
        fetchData(params);
        fetchStats();
      }, 300);
    },
    [pageSize, status, sortBy, sortDirection, fetchData, fetchStats],
  );

  const handleStatusChange = useCallback(
    (value: string | undefined) => {
      setStatus(value === "all" ? undefined : value);
      setPage(0);
    },
    [],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  }, []);

  const handleSort = useCallback((column: string, direction: "asc" | "desc") => {
    setSortBy(column);
    setSortDirection(direction);
    setPage(0);
  }, []);

  const refetch = useCallback(() => {
    const params: SearchParams = {
      page,
      size: pageSize,
      search: debouncedSearch.current,
      status,
      sortBy,
      sortDirection,
    };
    fetchData(params);
    fetchStats();
  }, [page, pageSize, status, sortBy, sortDirection, fetchData, fetchStats]);

  const create = useCallback(
    async (input: CreateApplicationInput) => {
      const newApp = await createApplication(input);
      refetch();
      return newApp;
    },
    [refetch],
  );

  const update = useCallback(
    async (id: string, input: CreateApplicationInput) => {
      const updated = await updateApplication(id, input);
      refetch();
      return updated;
    },
    [refetch],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteApplication(id);
      refetch();
    },
    [refetch],
  );

  return {
    data,
    stats,
    loading,
    error,
    search,
    status,
    page,
    pageSize,
    sortBy,
    sortDirection,
    handleSearch,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    refetch,
    create,
    update,
    remove,
  };
}
