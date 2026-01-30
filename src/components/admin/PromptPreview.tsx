import { PromptRequest } from "@/types/prompt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  User, 
  Calendar, 
  Tag, 
  Palette,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PromptPreviewProps {
  request: PromptRequest | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string) => void;
}

export function PromptPreview({ request, onAccept, onReject, onModify }: PromptPreviewProps) {
  if (!request) {
    return (
      <div className="h-full flex items-center justify-center bg-background/50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Select a request to preview</p>
        </div>
      </div>
    );
  }

  const isPending = request.status === "pending";

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with Actions */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-display font-bold text-foreground truncate">
              {request.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {request.creator}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {format(request.submittedAt, "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          {isPending && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={() => onAccept(request.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Accept
              </Button>
              <Button
                onClick={() => onReject(request.id)}
                variant="destructive"
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button
                onClick={() => onModify(request.id)}
                variant="outline"
                className="gap-2 border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:text-orange-400"
              >
                <Edit3 className="w-4 h-4" />
                Modify
              </Button>
            </div>
          )}
          
          {!isPending && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-sm px-3 py-1",
                request.status === "approved" && "border-emerald-500/50 text-emerald-500 bg-emerald-500/10",
                request.status === "rejected" && "border-red-500/50 text-red-500 bg-red-500/10",
                request.status === "needs_modification" && "border-orange-500/50 text-orange-500 bg-orange-500/10"
              )}
            >
              {request.status === "approved" && "Approved"}
              {request.status === "rejected" && "Rejected"}
              {request.status === "needs_modification" && "Needs Modification"}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Category & Style */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Category</span>
                </div>
                <p className="text-foreground font-medium">{request.category}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Palette className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Style</span>
                </div>
                <p className="text-foreground font-medium">{request.style}</p>
              </CardContent>
            </Card>
          </div>

          {/* Prompt Content */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Prompt Content</span>
              </div>
              <div className="bg-background/50 rounded-lg p-4 border border-border">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {request.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Tag className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Image */}
          {request.previewImage && (
            <Card className="bg-card/50 border-border overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Palette className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Preview</span>
                </div>
                <div className="rounded-lg overflow-hidden border border-border">
                  <img 
                    src={request.previewImage} 
                    alt="Preview" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
