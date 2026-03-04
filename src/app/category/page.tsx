import { Suspense } from "react";
import Category from "./CategoryClient";

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading category...</div>}>
      <Category />
    </Suspense>
  );
}
