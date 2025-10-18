import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import palak from "@/assets/crops/palak.webp";
import aarai from "@/assets/crops/aarai-green.jpg";
import siru from "@/assets/crops/siru-keerai.webp";
import pasala from "@/assets/crops/pasala-keerai.jpg";
import pulicha from "@/assets/crops/pulicha-keerai.webp";
import parupu from "@/assets/crops/parupu-keerai.jpg";

import tomato from "@/assets/crops/tomato.jpg";
import eggplant from "@/assets/crops/eggplant.jpg";
import bellPepper from "@/assets/crops/bell-pepper.jpg";
import chilliPepper from "@/assets/crops/chilli-pepper.jpg";
import squashes from "@/assets/crops/squashes-cucumbers.jpg";

import cabbage from "@/assets/crops/cabbage.jpg";
import brusselsSprouts from "@/assets/crops/brussel-sprouts.avif";
import cauliflower from "@/assets/crops/cauliflower.jpg";
import broccoli from "@/assets/crops/broccoli.webp";

import strawberry from "@/assets/crops/strawberry.jpg";

export const WhatCanBeGrown = () => {
  const categories = [
    {
      id: "leafy",
      title: "Leafy Greens & Lettuce",
      badge: "Optimal for Tower Farms",
      description: "Tower Garden & Tower Farms produce superior results regarding crop yield and nutrient density when it comes to leafy greens (chard, kale, spinach, etc.), lettuces of all kind, and aromatic herbs. This is why most Tower Farmers mainly focus on such plants from a farming profitability standpoint.",
      crops: [
        { name: "Palak", image: palak },
        { name: "Aarai", image: aarai },
        { name: "Siru Keerai", image: siru },
        { name: "Pasala Keerai", image: pasala },
        { name: "Pulicha Keerai", image: pulicha },
        { name: "Parupu Keerai", image: parupu },
      ],
    },
    {
      id: "fruiting",
      title: "Fruiting Vegetables",
      badge: "Requires Support Structure",
      description: "Fruiting vegetables (tomatoes, eggplants, bell peppers, chili peppers, squashes, and cucumbers) grow exceptionally well on Tower Garden as well. However, in most cases, the use of a grow cage or an outside structure is required to support the weight of the fruits. Although we recommend planting fruiting vegetables on a Tower Garden for personal use, we advise against such crops for Tower Farm aiming at profits. The same applies to all bean varieties.",
      crops: [
        { name: "Tomato", image: tomato },
        { name: "Eggplant", image: eggplant },
        { name: "Bell Peppers", image: bellPepper },
        { name: "Chilli Peppers", image: chilliPepper },
        { name: "Squashes & Cucumbers", image: squashes },
      ],
    },
    {
      id: "cruciferous",
      title: "Cruciferous Vegetables",
      badge: "Not for Commercial Use",
      description: "Cruciferous (cabbages, Brussels sprouts, cauliflower, broccoli...) grow extremely well on a Tower Garden... most of the time they grow so well that plants become too big for the towers. In most cases, a serious planning for a support structure is required. Cruciferous are not recommended for commercial Tower Farms.",
      crops: [
        { name: "Cabbage", image: cabbage },
        { name: "Brussels Sprouts", image: brusselsSprouts },
        { name: "Cauliflower", image: cauliflower },
        { name: "Broccoli", image: broccoli },
      ],
    },
    {
      id: "strawberries",
      title: "Strawberries",
      badge: "Worth the Wait",
      description: "Strawberries take a long time to grow from seed to fruit but are well worth the wait! Although no one is yet growing strawberries commercially in a Tower Farm, we advise growing strawberries using Tower Garden aeroponic systems for everyone! Strawberries will give bountiful harvests. Aside from looking impressive when growing vertically on a tower, strawberries grown aeroponically on the Tower Garden are superiorly sweet and juicy!",
      crops: [
        { name: "Strawberries", image: strawberry },
      ],
    },
  ];

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>What Can Be Grown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Discover what thrives in our Tower Garden aeroponic system
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="leafy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 h-auto p-1">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-[10px] sm:text-xs lg:text-sm whitespace-normal h-auto py-1.5 sm:py-2 px-1 sm:px-3"
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {category.badge}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {category.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {category.crops.map((crop) => (
                  <div key={crop.name} className="group">
                    <div className="aspect-square rounded-md sm:rounded-lg overflow-hidden mb-1.5 sm:mb-2">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs font-medium text-center leading-tight">{crop.name}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
