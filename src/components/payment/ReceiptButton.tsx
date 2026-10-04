"use client";

import { FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { downloadPaymentReceipt } from "@/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Payment } from "@/types/payment.type";

export function ReceiptButton({ payment }: { payment: Payment }) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    setLoading(true);
    try {
      const blob = await downloadPaymentReceipt(payment.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${payment.request?.trackingRef ?? payment.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not download receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" disabled={loading} onClick={download}>
      {loading ? <Spinner /> : <FileDown />} Receipt
    </Button>
  );
}