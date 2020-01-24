using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace Pomodoro.Models
{
    public class AppUser : IdentityUser
    {
        public List<TodoList> TodoLists { get; set; }
        public List<TimerSetting> TimerSetting { get; set; }

    }
}
