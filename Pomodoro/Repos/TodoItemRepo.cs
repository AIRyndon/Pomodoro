using Pomodoro.Models;
using Pomodoro.Repos;
using Pomodoro.Repos.Interfaces;

namespace Pomodoro.Data.Repos
{
    public class TodoItemRepo : BaseRepo<TodoItem>, ITodoItemRepo
    {
        public TodoItemRepo(ApplicationDbContext db) : base(db)
        {
        }
    }
}
