import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Routes, Route } from "react-router-dom";
import type { JSX } from "react";
import LoginPage from "./pages/LoginPageComponent";
import Homepage from "./pages/HomePageComponent";
import StudentPage from "./pages/StudentPageComponent";
import CoursePage from "./pages/CoursePageComponent";
import AuthenticationProvider from "./providers/AuthenticationProvider";
import PrivateRoute from "./components/PrivateRoute";
import UniversitiesProvider from "./providers/UniversitiesProvider";
import PermissionsPage from "./pages/PermissionsPageComponents";
import Layout from "./components/LayoutComponent";
import PermissionsProvider from "./providers/PermissionsProvider";
import MessagesProvider from "./providers/MessagesProvider";
import SharePage from "./pages/SharePageComponent";
import StatusPage from "./pages/StatusPageComponent";
import CredentialPage from "./pages/CredentialPageComponent";
import ImportPage from "./pages/ImportPageComponent";

/**
 * The main application component that sets up routing and authentication.
 * @author Diego Da Giau - Original implementation
 * @author tintun - Added Share, Status, and Credential routes
 * @returns {JSX.Element} The rendered component.
 * @remarks
 * This component uses the `AuthenticationProvider` to wrap the routes and ensure that
 * authentication is handled. The routes include:
 *
 * Original routes (Diego Da Giau):
 * - `/login` for the login page
 * - `/wallet` for the homepage, which displays the list of universities
 * - `/student` for the student page
 * - `/wallet/:code` for the course page
 * - `/permissions` for the permissions page
 *
 * Additional routes (tintun):
 * - `/share` for the share page
 * - `/status` for the status page
 * - `/credential` for the credential page
 * - `/import` for the CSV import page
 */
function App(): JSX.Element {
  return (
    <MessagesProvider>
      <AuthenticationProvider>
        <UniversitiesProvider>
          <PermissionsProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path="/wallet" element={<Homepage />} />
                  <Route path="/student" element={<StudentPage />} />
                  <Route path="/share" element={<SharePage />} />
                  <Route path="/status" element={<StatusPage />} />
                  <Route path="/credential" element={<CredentialPage />} />
                  <Route path="/import" element={<ImportPage />} />
                  <Route path="/wallet/:code" element={<CoursePage />} />
                  <Route path="/permissions" element={<PermissionsPage />} />
                </Route>
              </Route>
            </Routes>
          </PermissionsProvider>
        </UniversitiesProvider>
      </AuthenticationProvider>
    </MessagesProvider>
  );
}

export default App;
