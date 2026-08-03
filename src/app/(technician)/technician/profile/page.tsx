"use client";

import { Mail } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/features/users/components/profile-form";
import { EditTechnicianProfileForm } from "@/features/technicians/components/edit-technician-profile-form";
import { TechnicianProfileGate } from "@/features/technicians/components/technician-profile-gate";
import { useAuth } from "@/providers/auth-provider";
import { getInitials } from "@/lib/utils";

export default function TechnicianProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account details and your public technician profile.
        </p>
      </div>

      <Card className="p-6">
        <CardContent className="space-y-6 p-0">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.profileImage ?? undefined} alt={user.name} />
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-display text-lg font-semibold">{user.name}</p>
              <Badge variant="secondary" className="mt-1">
                Technician
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs">Email (not editable)</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="font-display mb-4 text-sm font-semibold">Account details</p>
            <ProfileForm user={user} />
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardContent className="p-0">
          <p className="font-display mb-4 text-sm font-semibold">Public technician profile</p>
          <TechnicianProfileGate>
            {(profile) => <EditTechnicianProfileForm profile={profile} />}
          </TechnicianProfileGate>
        </CardContent>
      </Card>
    </div>
  );
}
