using Microsoft.EntityFrameworkCore.Migrations;

namespace Pomodoro.Data.Migrations
{
    public partial class AddMoreTimerSetting : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TimerSetting_AppUserId",
                table: "TimerSetting");

            migrationBuilder.CreateIndex(
                name: "IX_TimerSetting_AppUserId",
                table: "TimerSetting",
                column: "AppUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TimerSetting_AppUserId",
                table: "TimerSetting");

            migrationBuilder.CreateIndex(
                name: "IX_TimerSetting_AppUserId",
                table: "TimerSetting",
                column: "AppUserId",
                unique: true,
                filter: "[AppUserId] IS NOT NULL");
        }
    }
}
