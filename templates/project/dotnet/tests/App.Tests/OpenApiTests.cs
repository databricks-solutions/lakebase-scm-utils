using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace App.Tests;

public class OpenApiTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task OpenApiDocument_ListsEndpoints()
    {
        var body = await factory.CreateClient().GetStringAsync("/openapi.json");

        Assert.Contains("\"/health\"", body);
    }

    [Fact]
    public async Task Docs_ServesSwaggerUi()
    {
        var response = await factory.CreateClient().GetAsync("/docs/index.html");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
