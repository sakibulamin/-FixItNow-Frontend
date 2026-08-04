"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Users as UsersIcon } from "lucide-react";

import { useAdminUsersQuery } from "@/features/admin/hooks";
import { BanUserButton } from "@/features/admin/components/ban-user-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getInitials } from "@/lib/utils";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { data: users, isPending, isError, refetch } = useAdminUsersQuery();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const filtered = useMemo(() => {
    const list = users ?? [];
    if (!debouncedQuery) return list;
    const q = debouncedQuery.toLowerCase();
    return list.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, debouncedQuery]);

  const { page, totalPages, paginatedItems, goToPage, resetPage } = usePagination(
    filtered,
    PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage every account on FixItNow.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            resetPage();
          }}
          placeholder="Search by name or email…"
          className="pl-9"
          aria-label="Search users"
        />
      </div>

      {isPending && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorState
          title="Couldn't load users"
          description="Something went wrong loading GET /admin/users."
          onRetry={() => refetch()}
        />
      )}

      {!isPending && !isError && filtered.length === 0 && (
        <EmptyState
          icon={UsersIcon}
          title="No users found"
          description={query ? "Try a different search term." : "No users exist yet."}
        />
      )}

      {!isPending && !isError && paginatedItems.length > 0 && (
        <>
          {/* Mobile-first: stacked cards below sm */}
          <div className="space-y-2 sm:hidden">
            {paginatedItems.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="aspect-square size-full object-cover"
                      />
                    ) : (
                      <AvatarImage src={undefined} alt={user.name} />
                    )}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{user.role}</Badge>
                    <StatusBadge status={user.status} />
                  </div>
                  <BanUserButton user={user} />
                </div>
              </Card>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-xl border sm:block">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-muted-foreground text-left text-xs">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedItems.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9">
                          {user.profileImage ? (
                            <Image
                              src={user.profileImage}
                              alt={user.name}
                              width={36}
                              height={36}
                              className="aspect-square size-full object-cover"
                            />
                          ) : (
                            <AvatarImage src={undefined} alt={user.name} />
                          )}
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <BanUserButton user={user} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} className="mt-2" />
        </>
      )}
    </div>
  );
}
