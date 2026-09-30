Feature: Todo management

  @story-1
  Rule: Creating a todo requires a title

    Scenario: A User adds a todo with a title
      Given the todo list is empty
      When Alex creates a todo titled "Buy groceries"
      Then the todo list has exactly one todo
      And that todo is titled "Buy groceries" and is not completed

    @negative
    Scenario: A blank title is refused
      Given the todo list is empty
      When Alex tries to create a todo with an empty title
      Then the todo list still has no todos

  @story-2
  Rule: Every User sees the same shared list of todos, oldest first

    Scenario: Todos appear in the order they were created
      Given Alex has created a todo titled "Buy groceries"
      And Alex has then created a todo titled "Write report"
      When Jordan views the todo list
      Then Jordan sees "Buy groceries" listed before "Write report"

  @story-3
  Rule: A todo's title can be updated

    Scenario: A User corrects a todo's title
      Given Alex has created a todo titled "By groceries"
      When Alex updates that todo's title to "Buy groceries"
      Then the todo is titled "Buy groceries"

    @negative
    Scenario: Clearing the title is refused
      Given Alex has created a todo titled "Buy groceries"
      When Alex tries to update that todo's title to an empty title
      Then the todo is still titled "Buy groceries"

  @story-4
  Rule: A todo can be marked complete and reopened

    Scenario: A User completes a todo
      Given Alex has created a todo titled "Buy groceries"
      When Alex marks that todo as complete
      Then the todo is shown as completed

    Scenario: A User reopens a completed todo
      Given Alex has created a todo titled "Buy groceries" and marked it complete
      When Alex reopens that todo
      Then the todo is shown as not completed

  @story-5
  Rule: A todo can be deleted

    Scenario: A User removes a todo they no longer need
      Given Alex has created a todo titled "Buy groceries"
      When Alex deletes that todo
      Then the todo list has no todo titled "Buy groceries"
