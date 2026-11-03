import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

const NotFound = lazy(() => import("./pages/NotFound"));
const Unsettled = lazy(() => import("./pages/Unsettled"));
const Editorial = lazy(() => import("./pages/Editorial"));
const EditorialPreview = lazy(() => import("./pages/EditorialPreview"));
const EditorialPost = lazy(() => import("./pages/EditorialPost"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/unsettled" element={<Unsettled />} />
          <Route path="/editorial" element={<Editorial />} />
          <Route path="/editorial-preview" element={<EditorialPreview />} />
          <Route path="/editorial-preview/:slug" element={<EditorialPost />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
