import { useCallback, useEffect, useState, type JSX } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListingTable,
  PageContent,
  PageTitle,
  Stack,
  TextField,
  Typography,
} from "@wso2/oxygen-ui";
import { todoApi } from "../api";
import type { components } from "../generated/todo-api";

type Todo = components["schemas"]["Todo"];

// The one screen wireframes.dsl draws: navbar (AppLayout) + heading + an
// add-todo row + a table of every todo, oldest first, with per-row
// Complete/Reopen, Edit and Delete actions (flow "Manage todos").
export default function TodoListPage(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadTodos = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await todoApi.GET("/todos", { params: { query: { limit: 100 } } });
    if (error || !data) {
      setLoadError("Could not load todos. Try again.");
    } else {
      // The API returns oldest first (listTodos); render its order as-is.
      setTodos(data.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const handleAdd = async (): Promise<void> => {
    const title = newTitle.trim();
    if (!title) {
      setAddError("Title is required.");
      return;
    }
    setAdding(true);
    setAddError(null);
    const { data, error } = await todoApi.POST("/todos", { body: { title } });
    setAdding(false);
    if (error || !data) {
      setAddError(error?.message ?? "Could not create the todo.");
      return;
    }
    setTodos((prev) => [...prev, data]);
    setNewTitle("");
  };

  const handleToggle = async (todo: Todo): Promise<void> => {
    setBusyId(todo.id);
    setRowError(null);
    const { data, error } = await todoApi.PUT("/todos/{todoId}", {
      params: { path: { todoId: todo.id } },
      body: { completed: !todo.completed },
    });
    setBusyId(null);
    if (error || !data) {
      setRowError("Could not update the todo.");
      return;
    }
    const updated = data;
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDelete = async (todo: Todo): Promise<void> => {
    setBusyId(todo.id);
    setRowError(null);
    const { error, response } = await todoApi.DELETE("/todos/{todoId}", {
      params: { path: { todoId: todo.id } },
    });
    setBusyId(null);
    if (error && response.status !== 404) {
      setRowError("Could not delete the todo.");
      return;
    }
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };

  const openEdit = (todo: Todo): void => {
    setEditing(todo);
    setEditTitle(todo.title);
    setEditError(null);
  };

  const closeEdit = (): void => {
    setEditing(null);
    setEditTitle("");
    setEditError(null);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editing) return;
    const title = editTitle.trim();
    if (!title) {
      setEditError("Title is required.");
      return;
    }
    setSaving(true);
    setEditError(null);
    const { data, error } = await todoApi.PUT("/todos/{todoId}", {
      params: { path: { todoId: editing.id } },
      body: { title },
    });
    setSaving(false);
    if (error || !data) {
      setEditError(error?.message ?? "Could not update the todo.");
      return;
    }
    const updated = data;
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    closeEdit();
  };

  return (
    <PageContent>
      <PageTitle>
        <PageTitle.Header>My Todos</PageTitle.Header>
      </PageTitle>

      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Add a new todo..."
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value);
            if (addError) setAddError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleAdd();
          }}
          error={Boolean(addError)}
          helperText={addError ?? " "}
          disabled={adding}
        />
        <Button variant="contained" onClick={() => void handleAdd()} disabled={adding || !newTitle.trim()}>
          Add
        </Button>
      </Stack>

      {rowError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setRowError(null)}>
          {rowError}
        </Alert>
      )}

      <ListingTable.Container>
        <ListingTable>
          <ListingTable.Head>
            <ListingTable.Row>
              <ListingTable.Cell>Todo</ListingTable.Cell>
              <ListingTable.Cell>Status</ListingTable.Cell>
              <ListingTable.Cell align="right">Actions</ListingTable.Cell>
            </ListingTable.Row>
          </ListingTable.Head>
          <ListingTable.Body>
            {loading ? (
              <ListingTable.Row>
                <ListingTable.Cell colSpan={3}>
                  <Typography color="text.secondary">Loading todos…</Typography>
                </ListingTable.Cell>
              </ListingTable.Row>
            ) : loadError ? (
              <ListingTable.Row>
                <ListingTable.Cell colSpan={3}>
                  <Typography color="error">{loadError}</Typography>
                </ListingTable.Cell>
              </ListingTable.Row>
            ) : todos.length === 0 ? (
              <ListingTable.Row>
                <ListingTable.Cell colSpan={3}>
                  <ListingTable.EmptyState
                    title="No todos yet"
                    description="Add your first todo using the box above."
                  />
                </ListingTable.Cell>
              </ListingTable.Row>
            ) : (
              todos.map((todo) => (
                <ListingTable.Row key={todo.id}>
                  <ListingTable.Cell>{todo.title}</ListingTable.Cell>
                  <ListingTable.Cell>
                    <Chip
                      label={todo.completed ? "Done" : "Open"}
                      color={todo.completed ? "success" : "default"}
                      size="small"
                    />
                  </ListingTable.Cell>
                  <ListingTable.Cell align="right">
                    <ListingTable.RowActions align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={busyId === todo.id}
                        onClick={() => void handleToggle(todo)}
                      >
                        {todo.completed ? "Reopen" : "Complete"}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={busyId === todo.id}
                        onClick={() => openEdit(todo)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={busyId === todo.id}
                        onClick={() => void handleDelete(todo)}
                      >
                        Delete
                      </Button>
                    </ListingTable.RowActions>
                  </ListingTable.Cell>
                </ListingTable.Row>
              ))
            )}
          </ListingTable.Body>
        </ListingTable>
      </ListingTable.Container>

      <Dialog open={editing !== null} onClose={closeEdit} fullWidth maxWidth="xs">
        <DialogTitle>Edit todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Title"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              if (editError) setEditError(null);
            }}
            error={Boolean(editError)}
            helperText={editError ?? " "}
            disabled={saving}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => void handleSaveEdit()} disabled={saving || !editTitle.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageContent>
  );
}
