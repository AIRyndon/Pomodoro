using System.Collections.Generic;

namespace Pomodoro.Models
{
    public class TodoList
    {
        public int Id { get; set; }
        public string AppUserId { get; set; }
        public string Description { get; set; }
        public bool MainList { get; set; }
        public List<TodoItem> TodoItems { get; set; }
    }
}
