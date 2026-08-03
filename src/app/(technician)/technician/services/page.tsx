"use client";

import { Wrench } from "lucide-react";

import { TechnicianProfileGate } from "@/features/technicians/components/technician-profile-gate";
import { ServiceFormDialog } from "@/features/services/components/service-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function TechnicianServicesPage() {
  return (
    <div className="space-y-6">
      <TechnicianProfileGate>
        {(profile) => {
          const services = profile.services ?? [];

          return (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-semibold">Your services</h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Manage the services customers can book from you.
                  </p>
                </div>
                <ServiceFormDialog technicianId={profile.id} />
              </div>

              {services.length === 0 ? (
                <EmptyState
                  icon={Wrench}
                  title="No services yet"
                  description="Add your first service so customers can book you."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {services.map((service) => (
                    <Card key={service.id} className="border-l-accent border-l-4 p-5">
                      <CardContent className="space-y-3 p-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display font-semibold">{service.title}</p>
                            {service.category?.name && (
                              <Badge variant="secondary" className="mt-1 text-[10px]">
                                {service.category.name}
                              </Badge>
                            )}
                          </div>
                          <ServiceFormDialog technicianId={profile.id} service={service} />
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {service.description}
                        </p>
                        <p className="font-display font-semibold">
                          {formatCurrency(service.price)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          );
        }}
      </TechnicianProfileGate>
    </div>
  );
}
