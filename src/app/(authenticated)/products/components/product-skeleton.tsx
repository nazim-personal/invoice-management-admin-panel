
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function ProductSkeleton() {
  return (
    <TableRow>
      <TableCell className="w-12">
        <Skeleton className="h-4 w-4" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px] md:hidden" />
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-6" />
      </TableCell>
    </TableRow>
  );
}
