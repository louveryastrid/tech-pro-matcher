import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";

const Agent = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Meet Orion</h1>
        <p className="text-muted-foreground mt-2">
          Your AI-powered job search assistant
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          AI assistant features coming soon! Orion will help you with:
        </p>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          <li>• Personalized job recommendations</li>
          <li>• Resume optimization tips</li>
          <li>• Interview preparation</li>
          <li>• Career advice and guidance</li>
        </ul>
      </Card>
    </div>
  );
};

export default Agent;
