using SignalRChat.Hubs;
using SignalRChat.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.;
builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration.GetValue<string>("clientUrl"))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSingleton<IDictionary<string, User>>(opts => new Dictionary<string, User>());


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors();

app.UseRouting();

app.MapHub<ChatHub>("/chatHub");

app.Run();
