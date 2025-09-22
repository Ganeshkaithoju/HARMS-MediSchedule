
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MessageSquare, Instagram } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
       <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Help & Support
          </h1>
          <p className="text-muted-foreground">
            We are here to assist you.
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Welcome to HARMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-lg">
                    Your premier destination for world-class healthcare. At HARMS, we combine cutting-edge technology with compassionate care, delivered by a team of renowned medical experts. Our state-of-the-art facilities and patient-centric approach ensure you receive the best possible treatment in a comfortable and supportive environment.
                </p>
                <p className="text-muted-foreground">
                    From routine check-ups to advanced surgical procedures, we are dedicated to your health and well-being. Trust HARMS for a healthier tomorrow.
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-primary" />
                    <p><strong>Email:</strong> harms@gmail.com</p>
                </div>
                 <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <p><strong>Mobile:</strong> +91 1234567890</p>
                </div>
                 <div className="flex items-center gap-4">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <p><strong>WhatsApp:</strong> +91 9876598760</p>
                </div>
                 <div className="flex items-center gap-4">
                    <Instagram className="h-5 w-5 text-primary" />
                    <p><strong>Instagram:</strong> @HARMS</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
