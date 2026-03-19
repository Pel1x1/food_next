import { getCategoriesServer } from "@/shared/api/categories";
import CategoriesClient from "./CategoriesClient";
import { CategoriesStoreProvider } from "@/shared/providers/CategoriesStoreProvider";

export default async function CategoriesPage() {
  const categories = await getCategoriesServer();

  return (
    <CategoriesStoreProvider initialCategories={categories}>
      <CategoriesClient />
    </CategoriesStoreProvider>
  );
}
