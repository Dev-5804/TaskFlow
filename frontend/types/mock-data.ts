export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type MockUser = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
};

export type MockTask = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
};

export type MockColumn = {
  id: string;
  title: string;
  taskIds: string[];
};

export type MockBoard = {
  id: string;
  name: string;
  description: string;
  color: string;
  updatedAt: string;
  columns: MockColumn[];
  tasks: Record<string, MockTask>;
};

export type MockWorkspace = {
  id: string;
  name: string;
  description: string;
  members: MockUser[];
  boardIds: string[];
};

export type MockActivity = {
  id: string;
  actor: MockUser;
  action: string;
  target: string;
  time: string;
};
