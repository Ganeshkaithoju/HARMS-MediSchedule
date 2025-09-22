

"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Resource } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

interface ResourceListProps {
  maxRows?: number;
  type?: Resource["type"];
}

export function ResourceList({ maxRows, type }: ResourceListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { resources, updateResourceStatus } = useAuth();

  const filteredResources = useMemo(() => {
    let items = resources;

    if (type) {
      items = items.filter((res) => res.type === type);
    }

    if (searchTerm) {
      items = items.filter((res) =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return items.sort((a,b) => a.name.localeCompare(b.name));
  }, [resources, searchTerm, type]);
  
  const displayedResources = maxRows ? filteredResources.slice(0, maxRows) : filteredResources;

  const handleStatusChange = (resourceId: string, newStatus: Resource['status']) => {
    updateResourceStatus(resourceId, newStatus);
  }
  
  const getBadgeVariant = (status: Resource['status']) => {
    switch (status) {
        case 'Available': return 'default';
        case 'Occupied': return 'destructive';
        case 'Low Stock': return 'secondary';
        default: return 'outline';
    }
  }

  const renderActions = (resource: Resource) => {
    switch (resource.type) {
      case 'Bed':
      case 'Equipment':
        return (
          <div className="flex items-center space-x-2 justify-end">
            <Label htmlFor={`status-switch-${resource.id}`} className="text-right">
              {resource.status === 'Available' ? 'Available' : 'Occupied'}
            </Label>
            <Switch
              id={`status-switch-${resource.id}`}
              checked={resource.status === 'Available'}
              onCheckedChange={(isChecked) =>
                handleStatusChange(resource.id, isChecked ? 'Available' : 'Occupied')
              }
            />
          </div>
        );
      case 'Medicine':
        return (
          <div className="flex justify-end space-x-2">
            <Button 
                variant={resource.status === 'Available' ? 'secondary' : 'default'}
                size="sm"
                onClick={() => handleStatusChange(resource.id, 'Available')}>
                Available
            </Button>
            <Button
                variant={resource.status === 'Low Stock' ? 'destructive' : 'default'}
                size="sm"
                onClick={() => handleStatusChange(resource.id, 'Low Stock')}>
                Low Stock
            </Button>
          </div>
        )
      default:
        return null;
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {!type && <TableHead>Type</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[200px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedResources.length > 0 ? (
              displayedResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  {!type && <TableCell>{resource.type}</TableCell>}
                  <TableCell>
                    <Badge variant={getBadgeVariant(resource.status)}>
                      {resource.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {renderActions(resource)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={type ? 3 : 4} className="text-center">
                  No resources found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
