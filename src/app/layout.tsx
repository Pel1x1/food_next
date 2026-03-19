import "@/app/globals.scss";
import Header from "@/shared/components/Header";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { StoreProvider } from "@/shared/providers/StoreProvider";
import { ThemeWrapper } from "@/shared/components/ThemeWrapper/ThemeWrapper";
import { FavouritesApi } from "@/shared/utils/favourites";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Food Client",
    template: "%s | Food Client",
  },
  description: "Recipe app built with Next.js",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [favourites] = await Promise.all([
    FavouritesApi.getAll().catch(() => []),
  ]);

  return (
    <html lang="en">
      <body className={roboto.className}>
        <StoreProvider initialData={{ favourites }}>
          <ThemeWrapper>
            <Header />
            <main>{children}</main>
          </ThemeWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
