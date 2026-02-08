"""
Phase 1: Console Todo Application
In-memory implementation of task management.

Features:
- Add Task
- View Tasks
- Update Task
- Delete Task
- Toggle Complete
"""

import sys
from datetime import datetime

class TodoApp:
    def __init__(self):
        self.tasks = []
        self.next_id = 1

    def add_task(self, title, description=""):
        task = {
            "id": self.next_id,
            "title": title,
            "description": description,
            "completed": False,
            "created_at": datetime.now()
        }
        self.tasks.append(task)
        self.next_id += 1
        print(f"✅ Task created (ID: {task['id']})")

    def list_tasks(self):
        if not self.tasks:
            print("📭 No tasks found.")
            return

        print("\n=== Your Tasks ===")
        for task in self.tasks:
            status = "✓" if task["completed"] else "○"
            print(f"[{status}] {task['id']}: {task['title']}")
            if task["description"]:
                print(f"    - {task['description']}")
        print("==================\n")

    def update_task(self, task_id, title=None, description=None):
        task = self._find_task(task_id)
        if task:
            if title: task["title"] = title
            if description: task["description"] = description
            print(f"📝 Task {task_id} updated.")
        else:
            print(f"❌ Task {task_id} not found.")

    def delete_task(self, task_id):
        task = self._find_task(task_id)
        if task:
            self.tasks.remove(task)
            print(f"🗑️ Task {task_id} deleted.")
        else:
            print(f"❌ Task {task_id} not found.")

    def toggle_complete(self, task_id):
        task = self._find_task(task_id)
        if task:
            task["completed"] = not task["completed"]
            status = "completed" if task["completed"] else "pending"
            print(f"🔄 Task {task_id} mark as {status}.")
        else:
            print(f"❌ Task {task_id} not found.")

    def _find_task(self, task_id):
        for task in self.tasks:
            if task["id"] == task_id:
                return task
        return None

    def run(self):
        print("🚀 Todo CLI App (Phase 1)")
        while True:
            print("\nOptions:")
            print("1. Add Task")
            print("2. List Tasks")
            print("3. Update Task")
            print("4. Delete Task")
            print("5. Toggle Status")
            print("6. Exit")
            
            choice = input("\nEnter choice (1-6): ").strip()

            if choice == "1":
                title = input("Title: ")
                desc = input("Description (optional): ")
                self.add_task(title, desc)
            elif choice == "2":
                self.list_tasks()
            elif choice == "3":
                try:
                    tid = int(input("Task ID: "))
                    title = input("New Title (leave blank to keep): ")
                    desc = input("New Desc (leave blank to keep): ")
                    self.update_task(tid, title if title else None, desc if desc else None)
                except ValueError:
                    print("Invalid ID")
            elif choice == "4":
                try:
                    tid = int(input("Task ID: "))
                    self.delete_task(tid)
                except ValueError:
                    print("Invalid ID")
            elif choice == "5":
                try:
                    tid = int(input("Task ID: "))
                    self.toggle_complete(tid)
                except ValueError:
                    print("Invalid ID")
            elif choice == "6":
                print("Goodbye! 👋")
                sys.exit(0)
            else:
                print("Invalid choice, try again.")

if __name__ == "__main__":
    app = TodoApp()
    app.run()
