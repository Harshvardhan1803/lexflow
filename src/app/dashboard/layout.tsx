import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50 flex">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          
          <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
