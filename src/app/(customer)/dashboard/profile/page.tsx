"use client";

import { Mail, User as UserIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/features/users/components/profile-form";
import { useAuth } from "@/providers/auth-provider";
import { formatDate, getInitials } from "@/lib/utils";

export default function CustomerProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update your name, phone, and address. Email, role, and account
          status can&apos;t be changed here.
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
                Customer
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Email (not editable)</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <UserIcon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Member since</p>
                <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="font-display mb-4 text-sm font-semibold">Edit details</p>
            <ProfileForm user={user} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
