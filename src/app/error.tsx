"use client";

import React from "react";
import { useEffect } from "react";
import Text from "@/shared/components/Text";
import Button from "@/shared/components/Button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ padding: "80px 24px", textAlign: "center" }}>
          <Text view="title" tag="h1">
            Something went wrong
          </Text>
          <Text view="p-16" style={{ marginTop: 16, marginBottom: 32 }}>
            Please try again or go back to the homepage.
          </Text>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}

