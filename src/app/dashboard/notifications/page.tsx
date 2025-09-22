
import { SendNotificationForm } from "@/components/notifications/send-notification-form";

export default function NotificationsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Send Notifications
        </h1>
        <p className="text-muted-foreground">
          Send email notifications to patients by triggering a backend process.
        </p>
      </div>
      <SendNotificationForm />
    </div>
  );
}
