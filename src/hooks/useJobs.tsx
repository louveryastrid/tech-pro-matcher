import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const ADZUNA_APP_ID = "YOUR_APP_ID"; // User needs to replace
const ADZUNA_API_KEY = "YOUR_API_KEY"; // User needs to replace

export interface Job {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
  salary_min?: number;
  salary_max?: number;
  created?: string;
  description?: string;
  redirect_url?: string;
}

export const useJobs = (filters?: {
  role?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  search?: string;
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_API_KEY,
        results_per_page: "20",
        what: filters?.search || filters?.role || "software developer",
        where: filters?.location || "USA",
        "content-type": "application/json",
      });

      if (filters?.salaryMin) {
        params.append("salary_min", filters.salaryMin.toString());
      }
      if (filters?.salaryMax) {
        params.append("salary_max", filters.salaryMax.toString());
      }

      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/us/search/1?${params}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data.results || []);
    } catch (error: any) {
      toast({
        title: "Error fetching jobs",
        description: "Please check your API credentials and try again",
        variant: "destructive",
      });
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters?.role, filters?.location, filters?.salaryMin, filters?.salaryMax, filters?.search]);

  return { jobs, loading, refetch: fetchJobs };
};
