import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useJobs } from "@/hooks/useJobs";
import { JobCard } from "@/components/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Jobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const { jobs, loading } = useJobs({ search, role, location });

  const calculateMatchScore = (job: any) => {
    return Math.floor(Math.random() * 30) + 70; // 70-100% for demo
  };

  const handleApply = async (job: any) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("applied_jobs").insert({
        user_id: user.id,
        job_id: job.id,
        job_title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        job_url: job.redirect_url,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        description: job.description,
        status: "applied",
      });

      if (error) throw error;

      setAppliedJobIds((prev) => new Set(prev).add(job.id));
      toast({
        title: "Application submitted!",
        description: `Applied to ${job.title}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async (job: any) => {
    if (!user) return;

    try {
      if (savedJobIds.has(job.id)) {
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("user_id", user.id)
          .eq("job_id", job.id);

        if (error) throw error;

        setSavedJobIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(job.id);
          return newSet;
        });
      } else {
        const { error } = await supabase.from("saved_jobs").insert({
          user_id: user.id,
          job_id: job.id,
          job_title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          job_url: job.redirect_url,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          description: job.description,
        });

        if (error) throw error;

        setSavedJobIds((prev) => new Set(prev).add(job.id));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAskOrion = (job: any) => {
    toast({
      title: "Ask Orion",
      description: "AI assistant feature coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-foreground">Find Your Next Role</h1>
        
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="fullstack">Full Stack</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value=".net">.NET</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="new york">New York</SelectItem>
              <SelectItem value="san francisco">San Francisco</SelectItem>
              <SelectItem value="austin">Austin</SelectItem>
              <SelectItem value="seattle">Seattle</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={calculateMatchScore(job)}
              onApply={() => handleApply(job)}
              onSave={() => handleSave(job)}
              onAskOrion={() => handleAskOrion(job)}
              isSaved={savedJobIds.has(job.id)}
              isApplied={appliedJobIds.has(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
