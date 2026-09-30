screen TodoList "See every todo, add new ones, and act on existing ones"
  navbar "Todo App"
  heading "My Todos"
  row
    input "Add a new todo..."
    right
    button "Add" primary  // adds inline to the list below; stays on this page
  table "Todo | Status | Actions"
    row "Buy groceries | Open | Complete | Edit | Delete"
    row "Write report | Done | Reopen | Edit | Delete"

flow "Manage todos"
  description "A User creates, views, updates, completes and deletes todos"
  TodoList
