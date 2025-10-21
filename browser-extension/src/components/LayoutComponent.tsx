import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Footer from "./FooterComponent";
import type { JSX } from "react";

export default function Layout(): JSX.Element {
  const location = useLocation();

  // Show footer only on specific routes
  const showFooter = [
    "/wallet",
    "/permissions",
    "/share",
    "/status",
    "/credential",
    "/import",
  ].includes(location.pathname);

  return (
    <div className={showFooter ? "page-with-footer" : ""}>
      <Outlet />
      {showFooter && <Footer />}
    </div>
  );
}
