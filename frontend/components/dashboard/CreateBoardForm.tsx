"use client";

import { useState } from "react";
import type { MockBoard } from "@/types/mock-data";

export function CreateBoardForm({ onCreate }: { onCreate: (board: MockBoard) => void }) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Give your board a name first.");
      return;
    }
    onCreate({
      id: `mock-${trimmedName.toLowerCase().replaceAll(" ", "-")}`,
      name: trimmedName,
      description: "A new space for the team’s next focused push.",
      color: "#8c78a8",
      updatedAt: "Created just now",
      columns: [
        { id: "todo", title: "To Do", taskIds: [] },
        { id: "progress", title: "In Progress", taskIds: [] },
        { id: "done", title: "Done", taskIds: [] },
      ],
      tasks: {},
    });
    setName("");
    setError("");
    setIsOpen(false);
  }

  if (!isOpen) return <button className="button button--primary" onClick={() => setIsOpen(true)}>+ Create board</button>;

  return (
    <form className="create-board-form" onSubmit={submit}>
      <label htmlFor="board-name">Board name</label>
      <div className="create-board-form__row"><input id="board-name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="e.g. Product launch" autoFocus /><button className="button button--primary" type="submit">Create</button><button className="button button--ghost" type="button" onClick={() => setIsOpen(false)}>Cancel</button></div>
      {error && <span className="form-error">{error}</span>}
    </form>
  );
}
