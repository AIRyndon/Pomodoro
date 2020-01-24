using Microsoft.EntityFrameworkCore.Migrations;

namespace Pomodoro.Data.Migrations
{
    public partial class UpdateTimerSettingColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ActiveSetting",
                table: "TimerSetting",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActiveSetting",
                table: "TimerSetting");
        }
    }
}
