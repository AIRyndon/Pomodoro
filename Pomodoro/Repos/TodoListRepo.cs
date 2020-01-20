using Pomodoro.Models;
using Pomodoro.Repos;
using Pomodoro.Repos.Interfaces;

namespace Pomodoro.Data.Repos
{
    public class TodoListRepo : BaseRepo<TodoList>, ITodoListRepo
    {
        public TodoListRepo(ApplicationDbContext db) : base(db)
        {
        }
    }
}
