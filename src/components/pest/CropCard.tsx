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
        "cursor-pointer transition-all duration-300 card-hover",
        isSelected && "ring-2 ring-primary shadow-lg scale-105"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <h3 className="font-semibold mb-2">{name}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1">
          {commonPests.slice(0, 2).map((pest) => (
            <Badge key={pest} variant="secondary" className="text-xs">
              {pest}
            </Badge>
          ))}
          {commonPests.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{commonPests.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
