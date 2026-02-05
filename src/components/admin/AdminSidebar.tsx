import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  FileText,
  Megaphone,
  Coins,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAdminAuthenticated } from "@/lib/adminAuth";
import { clearAgentAuthenticated, getAuthenticatedAgent } from "@/lib/agentAuth";

const menuItems = [
  { title: "Main", url: "/", icon: LayoutDashboard },
  { title: "Agents", url: "/agents", icon: Bot },
  { title: "Prompts", url: "/prompts", icon: FileText },
  { title: "Ads", url: "/ads", icon: Megaphone },
  { title: "Currency", url: "/currency", icon: Coins },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const agent = getAuthenticatedAgent();

  const menuItems = [
    { title: "Main", url: "/", icon: LayoutDashboard },
    ...(agent ? [] : [{ title: "Agents", url: "/agents", icon: Bot }]),
    ...(agent && agent.permissions.prompts ? [{ title: "Prompts", url: "/prompts", icon: FileText }] : []),
    ...(agent && agent.permissions.prompts ? [{ title: "Approved Prompts", url: "/approved-prompts", icon: CheckCircle }] : []),
    ...(agent && agent.permissions.ads ? [{ title: "Ads", url: "/ads", icon: Megaphone }] : []),
    ...(agent && agent.permissions.currency ? [{ title: "Currency", url: "/currency", icon: Coins }] : []),
    ...(agent && agent.permissions.aiCreatorRequests ? [{ title: "AI Creators", url: "/ai-creators", icon: Sparkles }] : []),
    ...(!agent ? [{ title: "Prompts", url: "/prompts", icon: FileText }] : []),
    ...(!agent ? [{ title: "Approved Prompts", url: "/approved-prompts", icon: CheckCircle }] : []),
    ...(!agent ? [{ title: "Ads", url: "/ads", icon: Megaphone }] : []),
    ...(!agent ? [{ title: "Currency", url: "/currency", icon: Coins }] : []),
    ...(!agent ? [{ title: "AI Creators", url: "/ai-creators", icon: Sparkles }] : []),
  ];

  const handleLogout = () => {
    if (agent) {
      clearAgentAuthenticated();
    } else {
      clearAdminAuthenticated();
    }
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span
            className={cn(
              "font-display font-bold text-sidebar-accent-foreground text-lg whitespace-nowrap transition-all duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            Kiranagram
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-sidebar-muted group-hover:text-primary",
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium whitespace-nowrap transition-all duration-300",
                      collapsed ? "opacity-0 w-0" : "opacity-100",
                    )}
                  >
                    {item.title}
                  </span>
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.title}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors group"
        >
          <LogOut className="w-5 h-5 text-sidebar-muted group-hover:text-primary" />
          <span
            className={cn(
              "text-sm font-medium whitespace-nowrap transition-all duration-300",
              collapsed ? "opacity-0 w-0" : "opacity-100",
            )}
          >
            Logout
          </span>
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
