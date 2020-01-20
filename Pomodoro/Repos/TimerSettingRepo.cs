using Pomodoro.Models;
using Pomodoro.Repos;
using Pomodoro.Repos.Interfaces;

namespace Pomodoro.Data.Repos
{
    //TODO-Ran out of time to add a persisted timer setting,will come back to this
    public class TimerSettingRepo : BaseRepo<TimerSetting>, ITimerSettingRepo
    {
        public TimerSettingRepo(ApplicationDbContext db) : base(db)
        {
        }
    }
}
