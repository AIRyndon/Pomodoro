using Pomodoro.Models;
using Pomodoro.Repos;
using Pomodoro.Repos.Interfaces;

namespace Pomodoro.Data.Repos
{

    public class TimerSettingRepo : BaseRepo<TimerSetting>, ITimerSettingRepo
    {
        public TimerSettingRepo(ApplicationDbContext db) : base(db)
        {
        }
    }
}
