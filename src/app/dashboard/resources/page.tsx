
"use client";

import { ResourceList } from "@/components/resources/resource-list";
import { AddResourceDialog } from "@/components/resources/add-resource-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Syringe, Stethoscope } from "lucide-react";

export default function ResourcesPage() {
  const { user, addResource, resources } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const resourceCounts = useMemo(() => {
    const allEquipment = resources.filter(r => r.type === 'Equipment');
    return {
      bedsAvailable: resources.filter(r => r.type === 'Bed' && r.status === 'Available').length,
      equipmentAvailable: allEquipment.filter(r => r.status === 'Available').length,
      totalEquipment: allEquipment.length,
      medicineLowStock: resources.filter(r => r.type === 'Medicine' && r.status === 'Low Stock').length,
    }
  }, [resources]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Resource Management
          </h1>
          <p className="text-muted-foreground">
            View, add, and update the status of all hospital resources.
          </p>
        </div>
        <AddResourceDialog onResourceAdded={addResource} />
      </div>

       <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourceCounts.bedsAvailable}</div>
            <p className="text-xs text-muted-foreground">
              Beds ready for patient assignment.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipment Availability</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {resourceCounts.equipmentAvailable}
                <span className="text-lg text-muted-foreground">/{resourceCounts.totalEquipment}</span>
            </div>
             <p className="text-xs text-muted-foreground">
              Number of equipment currently available.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medicine Low Stock</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourceCounts.medicineLowStock}</div>
             <p className="text-xs text-muted-foreground">
              Items that need to be restocked soon.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="beds">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="beds">Beds</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="medicine">Medicine</TabsTrigger>
        </TabsList>
        <TabsContent value="beds">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceList type="Bed" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Medical Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceList type="Equipment" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medicine">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceList type="Medicine" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
