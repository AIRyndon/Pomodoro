namespace Pomodoro.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        public int TodoListId { get; set; }
        public string Description { get; set; }
        public bool Finished { get; set; }
    }
}
