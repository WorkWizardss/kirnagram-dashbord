import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

export interface NormalUserRow {
  user_id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  gender: string;
  location: string;
  wallet: number;
  posts_count: number;
  remixes_count: number;
  created_at?: string;
  followers_count: number;
  following_count: number;
  account_type: string;
}

export interface AICreatorUserRow extends NormalUserRow {
  ai_creator_accepted_at?: string;
  prompts_count: number;
  total_remaining_money: number;
  withdraw_count: number;
}

interface UsersDetailsTableProps {
  normalUsers: NormalUserRow[];
  aiCreatorUsers: AICreatorUserRow[];
  totalUsers: number;
  loading?: boolean;
}

const displayText = (value?: string) => {
  const normalized = (value || "").trim();
  return normalized.length ? normalized : "-";
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const escapeCsvCell = (value: string | number | boolean | null | undefined) => {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\n") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
};

const downloadCsv = (
  fileName: string,
  headers: string[],
  rows: Array<Array<string | number | boolean | null | undefined>>,
) => {
  const csvLines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];

  // Include UTF-8 BOM so Excel opens Unicode text correctly.
  const csvContent = `\uFEFF${csvLines.join("\n")}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export function UsersDetailsTable({
  normalUsers,
  aiCreatorUsers,
  totalUsers,
  loading = false,
}: UsersDetailsTableProps) {
  const [selectedView, setSelectedView] = useState<"normal" | "creator">("normal");
  const subtleActionButtonClass =
    "h-10 rounded-xl border-border/70 bg-background/35 text-foreground shadow-sm hover:bg-background/55 disabled:opacity-100 disabled:text-foreground/45 disabled:border-border/35 disabled:bg-background/20";

  const onDownloadNormalUsers = () => {
    const headers = [
      "Name",
      "Username",
      "Mobile",
      "Email",
      "Gender",
      "Location",
      "Wallet",
      "Posts",
      "Remixes",
      "Created Date",
      "Followers",
      "Following",
      "Account Type",
    ];

    const rows = normalUsers.map((user) => [
      displayText(user.name),
      displayText(user.username),
      displayText(user.mobile),
      displayText(user.email),
      displayText(user.gender),
      displayText(user.location),
      user.wallet ?? 0,
      user.posts_count ?? 0,
      user.remixes_count ?? 0,
      formatDate(user.created_at),
      user.followers_count ?? 0,
      user.following_count ?? 0,
      displayText(user.account_type),
    ]);

    downloadCsv("normal-users-report.csv", headers, rows);
  };

  const onDownloadAICreators = () => {
    const headers = [
      "Name",
      "Username",
      "Mobile",
      "Email",
      "Gender",
      "Location",
      "Wallet",
      "Posts",
      "Remixes",
      "Created Date",
      "AI Creator Accepted Date",
      "Account Type",
      "Prompts",
      "Total Remaining Money",
      "Withdraw Count",
      "Followers",
      "Following",
    ];

    const rows = aiCreatorUsers.map((user) => [
      displayText(user.name),
      displayText(user.username),
      displayText(user.mobile),
      displayText(user.email),
      displayText(user.gender),
      displayText(user.location),
      user.wallet ?? 0,
      user.posts_count ?? 0,
      user.remixes_count ?? 0,
      formatDate(user.created_at),
      formatDate(user.ai_creator_accepted_at),
      displayText(user.account_type),
      user.prompts_count ?? 0,
      user.total_remaining_money ?? 0,
      user.withdraw_count ?? 0,
      user.followers_count ?? 0,
      user.following_count ?? 0,
    ]);

    downloadCsv("ai-creators-report.csv", headers, rows);
  };

  const onDownloadAllUsers = () => {
    const headers = [
      "User Type",
      "Name",
      "Username",
      "Mobile",
      "Email",
      "Gender",
      "Location",
      "Wallet",
      "Posts",
      "Remixes",
      "Created Date",
      "AI Creator Accepted Date",
      "Prompts",
      "Total Remaining Money",
      "Withdraw Count",
      "Followers",
      "Following",
      "Account Type",
    ];

    const normalRows = normalUsers.map((user) => [
      "Normal",
      displayText(user.name),
      displayText(user.username),
      displayText(user.mobile),
      displayText(user.email),
      displayText(user.gender),
      displayText(user.location),
      user.wallet ?? 0,
      user.posts_count ?? 0,
      user.remixes_count ?? 0,
      formatDate(user.created_at),
      "-",
      "-",
      "-",
      "-",
      user.followers_count ?? 0,
      user.following_count ?? 0,
      displayText(user.account_type),
    ]);

    const creatorRows = aiCreatorUsers.map((user) => [
      "AI Creator",
      displayText(user.name),
      displayText(user.username),
      displayText(user.mobile),
      displayText(user.email),
      displayText(user.gender),
      displayText(user.location),
      user.wallet ?? 0,
      user.posts_count ?? 0,
      user.remixes_count ?? 0,
      formatDate(user.created_at),
      formatDate(user.ai_creator_accepted_at),
      user.prompts_count ?? 0,
      user.total_remaining_money ?? 0,
      user.withdraw_count ?? 0,
      user.followers_count ?? 0,
      user.following_count ?? 0,
      displayText(user.account_type),
    ]);

    downloadCsv("all-users-report.csv", headers, [...normalRows, ...creatorRows]);
  };

  const activeCount = selectedView === "normal" ? normalUsers.length : aiCreatorUsers.length;

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">All Users Details</h3>
          <p className="text-sm text-foreground/75">
            One view container with clean toggle between Normal Users and AI Creator Users
          </p>
        </div>
        <div className="rounded-md bg-muted/60 px-3 py-1.5 text-sm font-medium text-foreground">
          Total Users: {totalUsers.toLocaleString()}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-muted/30 p-1.5 w-fit">
        <button
          type="button"
          onClick={() => setSelectedView("normal")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedView === "normal"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Normal Users ({normalUsers.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedView("creator")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedView === "creator"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          AI Creator Users ({aiCreatorUsers.length})
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          className={subtleActionButtonClass}
          onClick={onDownloadNormalUsers}
          disabled={loading || normalUsers.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Normal Users
        </Button>
        <Button
          variant="outline"
          className={subtleActionButtonClass}
          onClick={onDownloadAICreators}
          disabled={loading || aiCreatorUsers.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Download AI Creators
        </Button>
        <Button
          className="h-10 rounded-xl px-4 font-medium"
          onClick={onDownloadAllUsers}
          disabled={loading || (normalUsers.length + aiCreatorUsers.length === 0)}
        >
          <Download className="w-4 h-4 mr-2" />
          Download All Users
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-foreground">
          {selectedView === "normal" ? "Normal Users" : "AI Creator Users"}
        </h4>
        <span className="text-xs text-muted-foreground">Count: {activeCount}</span>
      </div>

      <Table className="text-foreground [&_th]:text-foreground/80 [&_th]:font-semibold [&_td]:text-foreground/95">
        {selectedView === "normal" ? (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Remixes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Following</TableHead>
                <TableHead>Account Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center text-muted-foreground font-medium">
                    Loading normal users...
                  </TableCell>
                </TableRow>
              ) : normalUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center text-muted-foreground font-medium">
                    No normal users found.
                  </TableCell>
                </TableRow>
              ) : (
                normalUsers.map((user) => (
                  <TableRow key={user.user_id} className="text-foreground/95">
                    <TableCell className="font-semibold">{displayText(user.name)}</TableCell>
                    <TableCell>{displayText(user.username) === "-" ? "-" : `@${displayText(user.username)}`}</TableCell>
                    <TableCell>{displayText(user.mobile)}</TableCell>
                    <TableCell>{displayText(user.email)}</TableCell>
                    <TableCell className="capitalize">{displayText(user.gender)}</TableCell>
                    <TableCell>{displayText(user.location)}</TableCell>
                    <TableCell className="font-medium">{user.wallet ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.posts_count ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.remixes_count ?? 0}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell className="font-medium">{user.followers_count ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.following_count ?? 0}</TableCell>
                    <TableCell className="capitalize">{displayText(user.account_type)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </>
        ) : (
          <>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Remixes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Accepted</TableHead>
                <TableHead>Prompts</TableHead>
                <TableHead>Remaining Money</TableHead>
                <TableHead>Withdraws</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Following</TableHead>
                <TableHead>Account Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={17} className="text-center text-muted-foreground font-medium">
                    Loading AI creator users...
                  </TableCell>
                </TableRow>
              ) : aiCreatorUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={17} className="text-center text-muted-foreground font-medium">
                    No AI creator users found.
                  </TableCell>
                </TableRow>
              ) : (
                aiCreatorUsers.map((user) => (
                  <TableRow key={user.user_id} className="text-foreground/95">
                    <TableCell className="font-semibold">{displayText(user.name)}</TableCell>
                    <TableCell>{displayText(user.username) === "-" ? "-" : `@${displayText(user.username)}`}</TableCell>
                    <TableCell>{displayText(user.mobile)}</TableCell>
                    <TableCell>{displayText(user.email)}</TableCell>
                    <TableCell className="capitalize">{displayText(user.gender)}</TableCell>
                    <TableCell>{displayText(user.location)}</TableCell>
                    <TableCell className="font-medium">{user.wallet ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.posts_count ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.remixes_count ?? 0}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>{formatDate(user.ai_creator_accepted_at)}</TableCell>
                    <TableCell className="font-medium">{user.prompts_count ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.total_remaining_money ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.withdraw_count ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.followers_count ?? 0}</TableCell>
                    <TableCell className="font-medium">{user.following_count ?? 0}</TableCell>
                    <TableCell className="capitalize">{displayText(user.account_type)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </>
        )}
      </Table>
    </div>
  );
}
