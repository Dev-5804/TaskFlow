import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { mockWorkspace, mockUsers } from "@/data/mock-data";

export function TopNav() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const initials = user?.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || mockUsers[0].initials;

  async function signOut() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="top-nav">
      <Link className="brand" href="/dashboard">
        <span className="brand-mark">T</span>
        <span>TaskFlow</span>
      </Link>
      <div className="top-nav__context">
        <span className="top-nav__label">Workspace</span>
        <strong>{mockWorkspace.name}</strong>
      </div>
      <div className="top-nav__actions">
        <button className="icon-button" aria-label="View notifications" title="Notifications">03</button>
        <div className="avatar-stack" aria-label="Online teammates">
          {mockUsers.slice(0, 3).map((user) => <span className="avatar avatar--small" style={{ backgroundColor: user.avatarColor }} key={user.id}>{user.initials}</span>)}
        </div>
        <button className="profile-button" aria-label="Sign out" onClick={signOut}>
          <span className="avatar" style={{ backgroundColor: mockUsers[0].avatarColor }}>{initials}</span>
          <span className="profile-button__name">{user?.name || "Profile"}</span>
          <span aria-hidden="true">⌄</span>
        </button>
      </div>
    </header>
  );
}
