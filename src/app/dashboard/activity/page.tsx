
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Users,
    FileText,
    CircleDollarSign,
    Package
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getRequest } from "@/lib/helpers/axios/RequestService";
import { handleApiError } from "@/lib/helpers/axios/errorHandler";
import { useToast } from "@/hooks/use-toast";
import { Activity, ActivityType } from "@/lib/types/activity";
import { ActivitySkeleton } from "./components/activity-skeleton";
import { ApiResponseTypes } from "@/lib/types/api";

const iconMap: Record<ActivityType, React.ElementType> = {
    Invoice: FileText,
    Customer: Users,
    Payment: CircleDollarSign,
    Product: Package,
};

export default function ActivityPage() {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const response: ApiResponseTypes<Activity[]> = await getRequest({ url: '/api/activities' });
        setActivities(response.data);
      } catch (err: any) {
        const parsed = handleApiError(err);
        toast({
          title: parsed.title,
          description: parsed.description,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const units = {
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [unit, seconds] of Object.entries(units)) {
        const interval = Math.floor(diffInSeconds / seconds);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <h1 className="text-2xl font-bold font-headline tracking-tight">
          Activity Feed
        </h1>
        <p className="text-muted-foreground">
          A log of recent activities in your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Activities</CardTitle>
          <CardDescription>
            Here is what has happened in your account recently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ActivitySkeleton />
          ) : (
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => {
                        const Icon = iconMap[activity.type];
                        return (
                            <li key={activity.id}>
                                <div className="relative pb-8">
                                {activityIdx !== activities.length - 1 ? (
                                    <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex items-start space-x-4">
                                    <div>
                                        <div className="relative px-1">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted ring-8 ring-background">
                                            <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1 py-3">
                                        <div className="text-sm font-medium text-foreground">
                                            {activity.title}
                                        </div>
                                        <p className="mt-0.5 text-sm text-muted-foreground">{activity.description}</p>
                                    </div>
                                    <div className="flex-shrink-0 self-center">
                                        <Badge variant={activity.variant as any}>{formatRelativeTime(activity.created_at)}</Badge>
                                    </div>
                                </div>
                                </div>
                            </li>
                        )}
                    )}
                </ul>
            </div>
           )}
        </CardContent>
      </Card>
    </main>
  );
}
