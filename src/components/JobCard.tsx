import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Users, Clock, Heart, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: {
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
  };
  matchScore?: number;
  onApply: () => void;
  onSave: () => void;
  onAskOrion: () => void;
  isSaved?: boolean;
  isApplied?: boolean;
}

export const JobCard = ({
  job,
  matchScore,
  onApply,
  onSave,
  onAskOrion,
  isSaved = false,
  isApplied = false,
}: JobCardProps) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 80) return "STRONG MATCH";
    if (score >= 60) return "GOOD MATCH";
    return "FAIR MATCH";
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Competitive";
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    return "Competitive";
  };

  return (
    <Card className="p-6 hover:border-primary transition-colors">
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center border border-border">
          <span className="text-2xl">{job.company.display_name[0]}</span>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground">{job.company.display_name}</p>
            </div>
            {matchScore && (
              <div className="flex flex-col items-center">
                <div className={`text-2xl font-bold ${getMatchScoreColor(matchScore)}`}>
                  {matchScore}%
                </div>
                <Badge variant="outline" className="text-xs">
                  {getMatchScoreLabel(matchScore)}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location.display_name}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {formatSalary(job.salary_min, job.salary_max)}
            </div>
            {job.created && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(new Date(job.created), { addSuffix: true })}
              </div>
            )}
          </div>

          {job.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description.replace(/<[^>]*>/g, "")}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              onClick={onApply}
              disabled={isApplied}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isApplied ? "Applied" : "Apply Now"}
            </Button>
            <Button
              onClick={onAskOrion}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask Orion
            </Button>
            <Button
              onClick={onSave}
              variant="ghost"
              size="icon"
              className={isSaved ? "text-primary" : ""}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
