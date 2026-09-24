import Link from "next/link";
import { mockWorkspace, mockUsers } from "@/data/mock-data";

export function TopNav() {
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
        <button className="profile-button" aria-label="Open profile menu">
          <span className="avatar" style={{ backgroundColor: mockUsers[0].avatarColor }}>{mockUsers[0].initials}</span>
          <span className="profile-button__name">Devendra</span>
          <span aria-hidden="true">⌄</span>
        </button>
      </div>
    </header>
  );
}
