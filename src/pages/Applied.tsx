import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Applied = () => {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("applied_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });

      if (!error && data) {
        setAppliedJobs(data);
      }
      setLoading(false);
    };

    fetchAppliedJobs();
  }, [user]);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Competitive";
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    return "Competitive";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-500/20 text-blue-500";
      case "interview":
        return "bg-yellow-500/20 text-yellow-500";
      case "offer":
        return "bg-green-500/20 text-green-500";
      case "rejected":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Applied Jobs</h1>
        <p className="text-muted-foreground mt-2">
          Track all your job applications in one place
        </p>
      </div>

      {appliedJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            You haven't applied to any jobs yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appliedJobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center border border-border">
                  <span className="text-2xl">{job.company[0]}</span>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {job.job_title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge className={getStatusColor(job.status || "applied")}>
                      {job.status || "Applied"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(job.salary_min, job.salary_max)}
                    </div>
                    {job.applied_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Applied{" "}
                        {formatDistanceToNow(new Date(job.applied_at), {
                          addSuffix: true,
                        })}
                      </div>
                    )}
                  </div>

                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description.replace(/<[^>]*>/g, "")}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applied;
