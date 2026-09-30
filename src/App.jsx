import AppRoutes from "./routes/AppRoutes";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
