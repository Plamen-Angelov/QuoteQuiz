using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuoteQuiz.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveQuizGameScore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Score",
                table: "QuizGames");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Score",
                table: "QuizGames",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
