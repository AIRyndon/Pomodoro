using Pomodoro.Models;
using Pomodoro.Repos;
using Pomodoro.Repos.Interfaces;

namespace Pomodoro.Data.Repos
{
    public class AppUserRepo : BaseRepo<AppUser>, IAppUserRepo
    {
        public AppUserRepo(ApplicationDbContext db) : base(db)
        {
        }
    }
}
