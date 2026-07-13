import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AnnouncementBar, Navbar, Footer } from "../components/site/Chrome";
import { StoreProvider } from "../lib/store";
import { AuthProvider } from "../lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">This page is off the shelf</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-luxury btn-luxury-hover">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display text-foreground">Something didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again — we're on it.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-luxury btn-luxury-hover"
          >Try again</button>
          <a href="/" className="inline-flex items-center rounded-full border border-input bg-background px-5 py-2 text-sm font-medium hover:bg-accent/40">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Woman Company — Premium Beauty & Body Care" },
      { name: "description", content: "Luxury body, face, hair, intimate care & fragrance. Shop bestsellers, new launches, and curated gift sets." },
      { name: "author", content: "The Woman Company" },
      { name: "theme-color", content: "#E91E63" },
      { property: "og:title", content: "The Woman Company — Premium Beauty & Body Care" },
      { property: "og:description", content: "Luxury body, face, hair, intimate care & fragrance. Shop bestsellers, new launches, and curated gift sets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Woman Company — Premium Beauty & Body Care" },
      { name: "twitter:description", content: "Luxury body, face, hair, intimate care & fragrance. Shop bestsellers, new launches, and curated gift sets." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/66714130-36af-4cec-9d61-4e3c28d56c45/id-preview-7b2ef8a2--2d7ec069-be75-40d4-86c7-d009633e4319.lovable.app-1783511476999.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/66714130-36af-4cec-9d61-4e3c28d56c45/id-preview-7b2ef8a2--2d7ec069-be75-40d4-86c7-d009633e4319.lovable.app-1783511476999.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <div className="flex min-h-screen flex-col bg-background">
            <AnnouncementBar />
            <Navbar />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
