using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace QuoteQuiz.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Quotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Author = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quotes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QuizGames",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Score = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizGames_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuizAnswers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuizGameId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuoteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SelectedAnswer = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    AnsweredAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuizAnswers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuizAnswers_QuizGames_QuizGameId",
                        column: x => x.QuizGameId,
                        principalTable: "QuizGames",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuizAnswers_Quotes_QuoteId",
                        column: x => x.QuoteId,
                        principalTable: "Quotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Quotes",
                columns: new[] { "Id", "Author", "CreatedAt", "Text" },
                values: new object[,]
                {
                    { new Guid("a5b3d1e6-7e8a-9b0c-4f1a-6a7b8c9d0e1f"), "Walt Disney", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "The way to get started is to quit talking and begin doing." },
                    { new Guid("b4c2e0f7-8f9a-0c1b-3a2b-7b8c9d0e1f2a"), "Will Rogers", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Don't let yesterday take up too much of today." },
                    { new Guid("b7c8e4a1-2f3e-4c5d-9a8f-1b2c3d4e5f6a"), "Steve Jobs", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "The only way to do great work is to love what you do." },
                    { new Guid("c3d1f9a8-9a0b-1d2c-2b3c-8c9d0e1f2a3b"), "Unknown", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "You learn more from failure than from success." },
                    { new Guid("c9d7f5b2-3a4f-5d6e-8b9c-2c3d4e5f6a7b"), "Steve Jobs", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Innovation distinguishes between a leader and a follower." },
                    { new Guid("d2e0a8b9-0b1c-2e3a-1c4b-9d0e1f2a3b4c"), "Vince Lombardi", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "It's not whether you get knocked down, it's whether you get up." },
                    { new Guid("d8e6a4c3-4b5a-6e7f-7c8a-3d4e5f6a7b8c"), "John Lennon", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "Life is what happens when you're busy making other plans." },
                    { new Guid("e1f9b7ca-1c2a-3f4b-0d5a-0e1f2a3b4c5d"), "Tony Robbins", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "The only impossible journey is the one you never begin." },
                    { new Guid("e7f5b3d4-5c6a-7f8a-6d9b-4e5f6a7b8c9d"), "Eleanor Roosevelt", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "The future belongs to those who believe in the beauty of their dreams." },
                    { new Guid("f6a4c2e5-6d7a-8a9b-5e0c-5f6a7b8c9d0e"), "Aristotle", new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "It is during our darkest moments that we must focus to see the light." }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "IsActive", "Username" },
                values: new object[,]
                {
                    { new Guid("9beb8c94-3a41-408d-8572-696d3daa0289"), new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "bob@example.com", true, "bob_wilson" },
                    { new Guid("a3ee8240-662c-4c49-b9fd-da879be07766"), new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "john@example.com", true, "john_doe" },
                    { new Guid("d3844151-b0ed-45cc-a8ee-b0c2de699fa8"), new DateTime(2024, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "jane@example.com", true, "jane_smith" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuizAnswers_QuizGameId",
                table: "QuizAnswers",
                column: "QuizGameId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAnswers_QuoteId",
                table: "QuizAnswers",
                column: "QuoteId");

            migrationBuilder.CreateIndex(
                name: "IX_QuizGames_UserId",
                table: "QuizGames",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuizAnswers");

            migrationBuilder.DropTable(
                name: "QuizGames");

            migrationBuilder.DropTable(
                name: "Quotes");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
