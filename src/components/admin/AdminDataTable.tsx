import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T> {
  title: string;
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  createUrl?: string;
  searchField?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  getId: (row: T) => string;
}

export default function AdminDataTable<T extends Record<string, any>>({
  title, columns, data, isLoading, createUrl, searchField, onEdit, onDelete, getId,
}: Props<T>) {
  const [search, setSearch] = useState("");

  const filtered = data?.filter((row) => {
    if (!search || !searchField) return true;
    const val = String(row[searchField] ?? "").toLowerCase();
    return val.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-devanagari-serif font-bold text-foreground">{title}</h1>
        {createUrl && (
          <Button asChild>
            <Link to={createUrl}><Plus className="h-4 w-4 mr-1" /> Add New</Link>
          </Button>
        )}
      </div>

      {searchField && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !filtered?.length ? (
        <p className="text-muted-foreground py-8 text-center">No records found.</p>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead className="w-28">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={getId(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <div className="flex gap-1">
                        {onEdit && (
                          <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button size="sm" variant="destructive" onClick={() => onDelete(row)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
