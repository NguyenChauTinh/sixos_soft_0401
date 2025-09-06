using Microsoft.EntityFrameworkCore;
using QuestPDF.Infrastructure;
using sixos_soft_0401.Models.M0401;
using sixos_soft_0401.Services.S0401.I0401.I0401_DSNguoiBenhThucHienCLS;
using sixos_soft_0401.Services.S0401.S0401_DSNguoiBenhThucHienCLS;
using sixos_soft_0401.Services.S0401.I0401.I0401_SoTuChoiMau;
using sixos_soft_0401.Services.S0401.S0401_SoTuChoiMau;
using sixos_soft_0401.Services.S0401.I0401.I0401_TheKhoDuoc;
using sixos_soft_0401.Services.S0401.S0401_TheKhoDuoc;
using System.Globalization;
using System.Text.Encodings.Web;
using System.Text.Unicode;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

builder.Services.AddDbContext<M0401AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Connection")));

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(20);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddScoped<I0401_DSNguoiBenhThucHienCLS, S0401_DSNguoiBenhThucHienCLS>();
builder.Services.AddScoped<I0401_SoTuChoiMau, S0401_SoTuChoiMau_Service>();
builder.Services.AddScoped<I0401_TheKhoDuoc, S0401_TheKhoDuoc_Service>();
builder.Services.AddHttpContextAccessor();

QuestPDF.Settings.License = LicenseType.Community;

var cultureInfo = new CultureInfo("vi-VN");
cultureInfo.DateTimeFormat.ShortDatePattern = "dd-MM-yyyy";
cultureInfo.DateTimeFormat.DateSeparator = "-";
CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseDeveloperExceptionPage();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSession();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
