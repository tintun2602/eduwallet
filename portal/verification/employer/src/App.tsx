import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerifyCredential from "./pages/VerifyCredential";
import DownloadCredential from "./pages/DownloadCredential";
import CredentialNotFound from "./pages/CredentialNotFound";

function App() {
  return (
    <Router>
      <div className="verification-app">
        <Routes>
          <Route path="/verify/:credentialId" element={<VerifyCredential />} />
          <Route
            path="/download/:credentialId"
            element={<DownloadCredential />}
          />
          <Route path="/not-found" element={<CredentialNotFound />} />
          <Route path="*" element={<CredentialNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
