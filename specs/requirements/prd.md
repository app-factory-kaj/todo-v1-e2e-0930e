# Todo App — PRD

## Problem Statement

People who keep track of small tasks often reach for scattered notes, sticky
notes, or memory alone, and lose track of what still needs doing. They need a
single, always-available place to jot down tasks and check them off as they're
done, without the overhead of accounts, setup, or a device-specific app.

## Solution

A lightweight todo application: a REST API backed by an in-memory store, and a
single-page web app that calls it. Anyone who opens the app sees the same
shared list of todos and can add, view, edit, complete, and delete them
immediately — no sign-in, no setup.

## Actors

- **User** — anyone who opens the web app. There are no accounts or roles;
every User sees and manages the same shared list of todos.

## User Stories

1. As a User, I want to create a todo with a title, so that I can capture
 something I need to do.
2. As a User, I want to view the list of all todos, so that I can see
 everything I still need to do and what I've finished.
3. As a User, I want to update a todo's title, so that I can correct or
 refine it after creating it.
4. As a User, I want to mark a todo as complete (and reopen it), so that I
 can track my progress.
5. As a User, I want to delete a todo, so that I can remove items I no
 longer need.

## Product Decisions

- No sign-in or authentication of any kind; every User shares one common
todo list.
- Data is kept in memory only inside the API service — no database, and no
platform resources of any kind. Restarting the API service clears all
todos.
- The web app is a single-page application that calls the REST API directly.
- Each todo has a title and a completed flag only — no description, due
date, priority, or category fields. *assumed*
- Todos are shown in the order they were created, with no sorting or
filtering controls. *assumed*

## Out of Scope

- User accounts, authentication, or authorization.
- Persistent storage or any database/platform resource.
- Due dates, priorities, categories, tags, reminders, or notifications.
- Multiple lists, multiple users, or sharing/collaboration features.
- Search, filtering, or sorting of todos.

## Open Questions

None currently — see Product Decisions for assumptions still open to
override.

## Further Notes

None.