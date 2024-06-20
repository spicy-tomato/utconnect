using IdentityProvider.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.Options;
using Shared.Presentation.Filters;

namespace IdentityProvider;

public static class ConfigureServices
{
    public static void AddPresentationServices(this IServiceCollection services)
    {
        services.AddControllersWithViews();
        // services.AddUtconnectSwashbuckle();
        services.AddHttpContextAccessor();

        services.AddMvc(options => { options.Filters.Add<HttpResponseExceptionFilter>(); })
            .AddViewLocalization(LanguageViewLocationExpanderFormat.Suffix,
                opts => { opts.ResourcesPath = "Resources"; })
            .AddDataAnnotationsLocalization()
            .ConfigureApiBehaviorOptions(options => { options.SuppressModelStateInvalidFilter = true; });

        // services.AddControllers().AddNewtonsoftJson(options =>
        //     options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);
    }

    public static async Task Configure(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            // app.UseUtconnectSwagger();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        using (IServiceScope scope = app.Services.CreateScope())
        {
            IdentityProviderContextInitializer initializer =
                scope.ServiceProvider.GetRequiredService<IdentityProviderContextInitializer>();
            await initializer.InitializeAsync();
            await initializer.SeedAsync();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRequestLocalization(app.Services.GetRequiredService<IOptions<RequestLocalizationOptions>>().Value);

        app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}")
            .RequireAuthorization();

        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapRazorPages();
    }
}