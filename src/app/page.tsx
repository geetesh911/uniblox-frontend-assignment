"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EcommerceStore } from "@/components/ecommerce-store";

export default function Home() {
  const [queryClient] = useState(new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <EcommerceStore />
    </QueryClientProvider>
  );
}
