
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SkeletonLoader() {
  return (
    <Card className="mt-4">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-8 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
