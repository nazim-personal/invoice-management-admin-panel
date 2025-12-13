
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function InvoiceSkeleton() {
  return (
    <TableRow>
      <TableCell className="w-12">
        <Skeleton className="h-4 w-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="text-right">
          <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-4 w-16 rounded-full" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-6 w-6" />
      </TableCell>
    </TableRow>
  );
}
