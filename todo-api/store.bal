// In-memory todo store. No database, no persistence — state resets on restart.

import ballerina/time;
import ballerina/uuid;

final map<Todo> todoById = {};
string[] todoOrder = [];

function addTodo(string title) returns Todo {
    string id = uuid:createRandomUuid();
    string createdAt = time:utcToString(time:utcNow());
    Todo todo = {id, title, completed: false, createdAt};
    todoById[id] = todo;
    todoOrder.push(id);
    return todo;
}

function findTodo(string id) returns Todo? {
    return todoById[id];
}

function allTodosOldestFirst() returns Todo[] {
    Todo[] result = [];
    foreach string id in todoOrder {
        Todo? todo = todoById[id];
        if todo is Todo {
            result.push(todo);
        }
    }
    return result;
}

function updateTodoById(string id, string? title, boolean? completed) returns Todo? {
    Todo? existing = todoById[id];
    if existing is () {
        return ();
    }
    Todo updated = existing.clone();
    if title is string {
        updated.title = title;
    }
    if completed is boolean {
        updated.completed = completed;
    }
    todoById[id] = updated;
    return updated;
}

function removeTodo(string id) returns boolean {
    if !todoById.hasKey(id) {
        return false;
    }
    Todo _ = todoById.remove(id);
    int? idx = todoOrder.indexOf(id);
    if idx is int {
        string _ = todoOrder.remove(idx);
    }
    return true;
}

function listTodosPage(int 'limit, int offset) returns inline_response_200 {
    Todo[] all = allTodosOldestFirst();
    int total = all.length();

    int safeLimit = 'limit;
    if safeLimit > 100 {
        safeLimit = 100;
    }
    if safeLimit < 0 {
        safeLimit = 0;
    }
    int safeOffset = offset;
    if safeOffset < 0 {
        safeOffset = 0;
    }

    int endIndex = safeOffset + safeLimit;
    if endIndex > total {
        endIndex = total;
    }

    Todo[] page = [];
    if safeOffset < total {
        page = all.slice(safeOffset, endIndex);
    }

    string? next = ();
    if endIndex < total {
        next = string `/todos?limit=${safeLimit}&offset=${endIndex}`;
    }

    string? previous = ();
    if safeOffset > 0 {
        int prevOffset = safeOffset - safeLimit;
        if prevOffset < 0 {
            prevOffset = 0;
        }
        previous = string `/todos?limit=${safeLimit}&offset=${prevOffset}`;
    }

    return {count: total, next, previous, data: page};
}
