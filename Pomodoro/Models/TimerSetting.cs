namespace Pomodoro.Models
{
    public class TimerSetting
    {
        public int Id { get; set; }
        public string AppUserId { get; set; }
        public string Description { get; set; }
        public int SessionMinutes { get; set; }
        public int ShortBreakMinutes { get; set; }
        public int LongBreakMinutes { get; set; }
        public int LongBreakInterval { get; set; }
        public bool ActiveSetting { get; set; }
    }
}
