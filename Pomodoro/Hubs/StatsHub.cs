using Microsoft.AspNetCore.SignalR;
using Pomodoro.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pomodoro.Hubs
{
    public class StatsHub : Hub
    {
        public async Task SendListAdded(string message)
        {
            await Clients.All.SendAsync("ReceiveListAdded", message);
        }

        public async Task SendItemAdded(string message)
        {
            await Clients.All.SendAsync("ReceiveItemAdded", message);
        }
    }
}
