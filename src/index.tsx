import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import Home from "./pages/home";
import SearchResult from "./pages/searchResult";
import UploadExcel from "./upload";



const root = createRoot(document.getElementById("app") as HTMLElement);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/upload" element={<UploadExcel/>} />
        <Route path="/searchResult" element={<SearchResult />} />
      </Routes>
    </Router>
  </QueryClientProvider>
);