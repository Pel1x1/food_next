import React from "react";
import Link from "next/link";
import Text from "@/shared/components/Text";
import Button from "@/shared/components/Button";
import { AppRoutePaths } from "@/app/routes";

export default function NotFoundPage() {
  return (
    <div style={{ padding: "80px 24px", textAlign: "center" }}>
      <Text view="title" tag="h1">
        Page not found
      </Text>
      <Text view="p-16" >
        The page you are looking for does not exist or has been moved.
      </Text>
      <Link href={AppRoutePaths.home}>
        <Button >Go to homepage</Button>
      </Link>
    </div>
  );
}

