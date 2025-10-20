"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  tag?: string;
  priority?: "High" | "Medium" | "Low";
}

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [customTag, setCustomTag] = useState(""); // For user-defined tag
  const [priority, setPriority] = useState<"High" | "Medium" | "Low" | "">("");
  const [filter, setFilter] = useState<"All" | "Completed" | "Pending">("All");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const predefinedTags = ["Work", "Personal", "Shopping", "Other", "Custom"];

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add or update task
  const handleSave = async () => {
    if (!title.trim()) return;

    const finalTag = tag === "Custom" ? customTag : tag;

    try {
      if (editingTask) {
        const res = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editingTask,
            title,
            description,
            tag: finalTag || null,
            priority: priority || null,
            completed: editingTask.completed,
          }),
        });
        const updated = await res.json();
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
        setEditingTask(null);
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            tag: finalTag || null,
            priority: priority || null,
            completed: false,
          }),
        });
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
      }

      // Reset inputs
      setTitle("");
      setDescription("");
      setTag("");
      setCustomTag("");
      setPriority("");
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  // Toggle completed
  const toggleComplete = async (task: Task) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  // Delete task
  const confirmDelete = async (id: number) => {
    try {
      await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setTasks(tasks.filter((t) => t.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((task) => {
    const searchMatch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    const filterMatch =
      filter === "All" ||
      (filter === "Completed" && task.completed) ||
      (filter === "Pending" && !task.completed);
    return searchMatch && filterMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBorderColor = (priority?: string) => {
    switch (priority) {
      case "High":
        return "border-red-500";
      case "Medium":
        return "border-yellow-400";
      case "Low":
        return "border-green-500";
      default:
        return "border-gray-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-50 p-6 md:p-12">
      <h1 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Task Manager
      </h1>

      {/* Input Area */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
        {/* Tag Dropdown */}
        <div className="flex-1">
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
          >
            <option value="">Select Tag</option>
            {predefinedTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {tag === "Custom" && (
            <input
              type="text"
              placeholder="Enter custom tag"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          )}
        </div>
        {/* Priority Dropdown */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <div className="flex gap-2">
          {(["All", "Completed", "Pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-indigo-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`relative flex justify-between items-start p-5 rounded-xl shadow-md ${
              task.completed ? "bg-green-50" : "bg-white"
            } ${getBorderColor(task.priority)}`}
          >
            <div className="flex items-start gap-3 w-full">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
                className="w-5 h-5 mt-1 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-400"
              />
              <div className="flex-1">
                <p
                  className={`font-semibold text-lg ${
                    task.completed ? "text-green-700" : "text-gray-900"
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-gray-500 text-sm">{task.description}</p>
                {task.tag && (
                  <span className="inline-block px-2 py-1 mt-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                    {task.tag}
                  </span>
                )}
                {task.priority && (
                  <span
                    className={`inline-block px-2 py-1 mt-1 ml-2 text-sm font-semibold rounded-full ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  setEditingTask(task);
                  setTitle(task.title);
                  setDescription(task.description);
                  setTag(task.tag || "");
                  setPriority(task.priority || "");
                  setCustomTag(task.tag || "");
                }}
                className="text-black hover:text-gray-800"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={() =>
                  setDeleteConfirm(deleteConfirm === task.id ? null : task.id)
                }
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2 size={18} />
              </button>
            </div>

            {/* Delete confirmation */}
            {deleteConfirm === task.id && (
              <div className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center rounded-xl border border-gray-300 shadow-lg">
                <p className="text-gray-700 mb-3 font-semibold">
                  Delete this task?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => confirmDelete(task.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <footer className="mt-6 text-center text-gray-700 py-4 bg-blue-50 w-full">
        <span className="font-medium">K Jevaneswari</span> |{" "}
        <a
          href="https://www.linkedin.com/in/jevaneswari-k-937a312a0/"
          target="_blank"
          className="hover:underline"
        >
          LinkedIn
        </a>{" "}
        |{" "}
        <a
          href="https://github.com/JevaneswariK"
          target="_blank"
          className="hover:underline"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}