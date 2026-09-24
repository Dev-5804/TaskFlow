import type {
  MockActivity,
  MockBoard,
  MockTask,
  MockUser,
  MockWorkspace,
} from "@/types/mock-data";

export const mockUsers: MockUser[] = [
  { id: "dev", name: "Devendra Shah", initials: "DS", avatarColor: "#e5a84b" },
  { id: "rahul", name: "Rahul Mehta", initials: "RM", avatarColor: "#5c8d89" },
  { id: "amit", name: "Amit Nair", initials: "AN", avatarColor: "#c8785b" },
  { id: "maya", name: "Maya Iyer", initials: "MI", avatarColor: "#8c78a8" },
];

const tasks = {
  "website-brief": { id: "website-brief", title: "Shape the product brief", description: "Turn the customer interviews into a clear first pass.", priority: "HIGH", assigneeId: "dev", dueDate: "Today" },
  "website-nav": { id: "website-nav", title: "Refine navigation states", description: "Make the active and hover states feel intentional.", priority: "MEDIUM", assigneeId: "rahul", dueDate: "Tomorrow" },
  "website-board": { id: "website-board", title: "Review board hierarchy", description: "Check the information rhythm across the main views.", priority: "LOW", assigneeId: "maya" },
  "website-copy": { id: "website-copy", title: "Write empty states", description: "Give every quiet screen a useful next action.", priority: "MEDIUM", assigneeId: "amit" },
  "website-test": { id: "website-test", title: "Run mobile pass", description: "Check the board at small viewport widths.", priority: "URGENT", assigneeId: "dev", dueDate: "Friday" },
  "website-ready": { id: "website-ready", title: "Approve visual direction", description: "The first visual review is complete.", priority: "LOW", assigneeId: "rahul" },
  "mobile-flow": { id: "mobile-flow", title: "Map onboarding flow", description: "Document the first five minutes for a new teammate.", priority: "HIGH", assigneeId: "maya", dueDate: "Thursday" },
  "mobile-tokens": { id: "mobile-tokens", title: "Collect design tokens", description: "Align spacing, type, and color across mobile surfaces.", priority: "MEDIUM", assigneeId: "dev" },
  "mobile-release": { id: "mobile-release", title: "Prepare release notes", description: "Capture the changes for the next internal build.", priority: "LOW", assigneeId: "amit" },
  "api-contract": { id: "api-contract", title: "Document API contracts", description: "List the request and response shapes for the first slice.", priority: "HIGH", assigneeId: "dev", dueDate: "Monday" },
  "api-health": { id: "api-health", title: "Add service health checks", description: "Make local service status easy to inspect.", priority: "URGENT", assigneeId: "rahul" },
  "api-indexes": { id: "api-indexes", title: "Plan query indexes", description: "Identify the first read paths that need support.", priority: "LOW", assigneeId: "maya" },
} satisfies Record<string, MockTask>;

export const mockBoards: MockBoard[] = [
  {
    id: "website-redesign",
    name: "Website Redesign",
    description: "Shape the next chapter of the TaskFlow workspace.",
    color: "#e5a84b",
    updatedAt: "Updated 12 min ago",
    columns: [
      { id: "todo", title: "To Do", taskIds: ["website-brief", "website-nav"] },
      { id: "progress", title: "In Progress", taskIds: ["website-board", "website-copy"] },
      { id: "done", title: "Done", taskIds: ["website-test", "website-ready"] },
    ],
    tasks: Object.fromEntries(Object.entries(tasks).filter(([id]) => id.startsWith("website-"))),
  },
  {
    id: "mobile-app",
    name: "Mobile App",
    description: "Turn the daily planning ritual into a pocket-sized habit.",
    color: "#5c8d89",
    updatedAt: "Updated 1 hr ago",
    columns: [
      { id: "todo", title: "To Do", taskIds: ["mobile-flow"] },
      { id: "progress", title: "In Progress", taskIds: ["mobile-tokens"] },
      { id: "done", title: "Done", taskIds: ["mobile-release"] },
    ],
    tasks: Object.fromEntries(Object.entries(tasks).filter(([id]) => id.startsWith("mobile-"))),
  },
  {
    id: "backend-platform",
    name: "Backend Platform",
    description: "Lay the reliable foundation beneath every board.",
    color: "#c8785b",
    updatedAt: "Updated yesterday",
    columns: [
      { id: "todo", title: "To Do", taskIds: ["api-contract"] },
      { id: "progress", title: "In Progress", taskIds: ["api-health"] },
      { id: "done", title: "Done", taskIds: ["api-indexes"] },
    ],
    tasks: Object.fromEntries(Object.entries(tasks).filter(([id]) => id.startsWith("api-"))),
  },
];

export const mockWorkspace: MockWorkspace = {
  id: "studio-11",
  name: "Studio 11",
  description: "A small, focused team building thoughtful software.",
  members: mockUsers,
  boardIds: mockBoards.map((board) => board.id),
};

export const mockActivities: MockActivity[] = [
  { id: "activity-1", actor: mockUsers[0], action: "moved", target: "Run mobile pass", time: "12 min ago" },
  { id: "activity-2", actor: mockUsers[1], action: "commented on", target: "Refine navigation states", time: "38 min ago" },
  { id: "activity-3", actor: mockUsers[2], action: "completed", target: "Prepare release notes", time: "1 hr ago" },
  { id: "activity-4", actor: mockUsers[3], action: "joined", target: "Studio 11", time: "Yesterday" },
];
