import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import palakImage from "@/assets/crops/palak.webp";

export const CurrentlyGrownCrops = () => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Currently Grown Crops</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3">
            <img 
              src={palakImage} 
              alt="Palak (Spinach)" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <h3 className="text-xl font-semibold text-primary">Palak (Spinach)</h3>
            <p className="text-muted-foreground">
              Palak is currently thriving in our aeroponic system. This nutrient-dense leafy green is one of the 
              best performers in vertical farming, showing excellent growth rates and superior nutrient density 
              compared to traditional soil-grown varieties. Our current batch is expected to reach harvest maturity 
              within the next 2-3 weeks.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-foreground">Days to Harvest:</p>
                <p className="text-muted-foreground">25-30 days</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Growth Status:</p>
                <p className="text-success">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
