import { getProcedureBySiteId } from "@/lib/actions/procedures";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Procedure {
  id: number;
  name: string;
  duration: number;
}

interface ProcedureListProps {
  siteId: string;
}

export default function ProcedureList({ siteId }: ProcedureListProps) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);

  useEffect(() => {
    const fetchProcedures = async () => {
      const data = await getProcedureBySiteId(siteId);
      const convertedData =
        data?.map((procedure, index) => ({
          ...procedure,
          id: isNaN(Number(procedure.id)) ? index : Number(procedure.id),
        })) || [];
      setProcedures(convertedData);
    };

    fetchProcedures();
  }, [siteId]);

  return (
    <div className="rounded-lg border bg-background-primary shadow-md p-6">
      {procedures.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[150px] text-center">
                Délka (min)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.map((procedure) => (
              <TableRow key={procedure.id}>
                <TableCell className="text-center">
                  {procedure.id + 1}
                </TableCell>
                <TableCell>{procedure.name}</TableCell>
                <TableCell className="text-center">
                  {procedure.duration}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground">No procedures found</p>
      )}
    </div>
  );
}
