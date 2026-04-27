# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** — Stores registered user accounts. Each user has a unique email, a hashed password, and a display name.
- **projects** — Stores projects owned by a user. Each project belongs to one user and can be archived without deletion.
- **tasks** — Stores tasks that belong to a project. Each task contains embedded subtasks and a tags array.
- **notes** — Stores notes owned by a user. Notes can optionally be linked to a project or exist as standalone entries.


---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
name: string (required),
description: string (optional),
archived: boolean (required, default: false),
createdAt: Date (required)
}

### tasks
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
projectId: ObjectId (required, ref: projects),
title: string (required),
status: string (required, one of: "todo" | "in-progress" | "done"),
priority: number (required, default: 1),
tags: string[] (required, default: []),
subtasks: [
{
title: string (required),
done: boolean (required)
}
] (required, default: []),
dueDate: Date (optional),
createdAt: Date (required)
}

### notes
{
_id: ObjectId,
ownerId: ObjectId (required, ref: users),
projectId: ObjectId (optional, ref: projects),
title: string (required),
content: string (required),
tags: string[] (required, default: []),
createdAt: Date (required)
}

---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship                       | Embed or Reference? | Why? |
|-----------------------------------|---------------------|------|
| Subtasks inside a task            |        Embed        |Subtasks live INSIDE the task document. You never need a subtask without its task.|
| Tags on a task                    |        Embed        |Tags are just a simple string array ("urgent", "backend") sitting inside the task. No separate collection needed.|
| Project → Task ownership          |     Reference       |A task stores projectId: ObjectId(...) pointing to the projects collection. Tasks are big and queried separately.|
| Note → optional Project link      |     Reference       |A note stores projectId: ObjectId(...) if it belongs to a project. If it's standalone, projectId is just omitted.|

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

> The `dueDate` field exists on **some task documents but not all**. Tasks that have a deadline include `dueDate: Date`, while tasks with no deadline simply omit the field entirely. In MongoDB this is acceptable because documents in the same collection do not need identical fields — the absence of a field is treated as `null` and does not cause errors, unlike SQL which would require a `NULL` column defined upfront.