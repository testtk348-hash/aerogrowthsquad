import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CropCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  commonPests: string[];
  isSelected: boolean;
  onClick: () => void;
}

export const CropCard = ({
  name,
  image,
  description,
  commonPests,
  isSelected,
  onClick,
}: CropCardProps) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group",
        isSelected && "ring-2 ring-primary shadow-xl scale-[1.02] bg-primary/5"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-[4/3] rounded-t-lg overflow-hidden bg-muted relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Common Issues:
            </p>
            <div className="flex flex-wrap gap-1">
              {commonPests.slice(0, 2).map((pest) => (
                <Badge key={pest} variant="secondary" className="text-xs">
                  {pest}
                </Badge>
              ))}
              {commonPests.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{commonPests.length - 2} more
                </Badge>
              )}
            </div>
          </div>
          
          {isSelected && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-primary font-medium">
                ✓ Selected - Continue to upload
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
