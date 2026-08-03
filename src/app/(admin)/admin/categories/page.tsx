"use client";

import { Tags } from "lucide-react";

import { useCategoriesQuery } from "@/features/categories/hooks";
import { CategoryFormDialog } from "@/features/categories/components/category-form-dialog";
import { DeleteCategoryButton } from "@/features/categories/components/delete-category-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoriesPage() {
  const { data: categories, isPending, isError, refetch } = useCategoriesQuery();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage the service categories customers browse by.
          </p>
        </div>
        <CategoryFormDialog />
      </div>

      {isPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState title="Couldn't load categories"
          description="Something went wrong loading GET /categories."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && categories && categories.length === 0 && (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Add your first category so technicians can list services under it."
        />
      )}

      {!isPending && !isError && categories && categories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="border-l-accent border-l-4 p-5">
              <CardContent className="space-y-3 p-0">
                <p className="font-display font-semibold">{category.name}</p>
                <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm">
                  {category.description || "No description."}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <CategoryFormDialog category={category} />
                  <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
