"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadIcon } from "lucide-react";
import Papa from "papaparse";
import { BulkCreateTransactionsAction } from "@/actions/transactionImport";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CSVTransaction {
  amount: number;
  description: string;
  date: string;
  category: string;
  type: string;
}

export default function ImportCsvModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [previewData, setPreviewData] = useState<CSVTransaction[]>([]);
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const parseFile = () => {
    if (!file) return;
    setParsing(true);
    Papa.parse<CSVTransaction>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsing(false);
        const parsed = results.data.map(row => ({
          ...row,
          amount: parseFloat(String(row.amount)),
        }));
        setPreviewData(parsed);
      },
      error: (error) => {
        setParsing(false);
        toast.error(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const importMutation = useMutation({
    mutationFn: BulkCreateTransactionsAction,
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("Transactions imported successfully.");
        queryClient.invalidateQueries({ queryKey: ["transactionHistory"] });
        queryClient.invalidateQueries({ queryKey: ["overview"] });
        setOpen(false);
        setFile(null);
        setPreviewData([]);
      } else {
        toast.error(data?.error || "Failed to import transactions");
      }
    },
    onError: () => {
      toast.error("Failed to import transactions due to an unexpected error");
    }
  });

  const handleImport = () => {
    importMutation.mutate(previewData.map(d => ({
        ...d,
        date: new Date(d.date).toISOString(),
        type: d.type.toLowerCase() === "income" ? "income" : "expense"
    })));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UploadIcon className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Import Transactions via CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with headers: date, amount, description, type, category.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            <Button onClick={parseFile} disabled={!file || parsing} variant="secondary">
              Parse File
            </Button>
          </div>

          {previewData.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Preview ({previewData.length} rows)</h3>
              <div className="max-h-64 overflow-auto border rounded-md p-2">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground sticky top-0">
                    <tr>
                      <th className="p-2 font-medium">Date</th>
                      <th className="p-2 font-medium">Description</th>
                      <th className="p-2 font-medium">Amount</th>
                      <th className="p-2 font-medium">Type</th>
                      <th className="p-2 font-medium">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="p-2">{row.date}</td>
                        <td className="p-2">{row.description}</td>
                        <td className="p-2">{row.amount}</td>
                        <td className="p-2">{row.type}</td>
                        <td className="p-2">{row.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 5 && (
                  <div className="p-2 text-center text-xs text-muted-foreground">
                    ... and {previewData.length - 5} more rows
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleImport} disabled={importMutation.isPending}>
                  {importMutation.isPending ? "Importing..." : "Confirm Import"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
