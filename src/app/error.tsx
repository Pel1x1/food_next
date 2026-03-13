"use client";

import React, { useEffect } from "react";
import Text from "@/shared/components/Text";
import Button from "@/shared/components/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    // Убрали <html lang="en"> и <body>
    <div style={{ padding: "80px 24px", textAlign: "center" }}>
      <Text view="title" tag="h1">
        Something went wrong
      </Text>
      <div style={{ marginTop: 24 }}>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
