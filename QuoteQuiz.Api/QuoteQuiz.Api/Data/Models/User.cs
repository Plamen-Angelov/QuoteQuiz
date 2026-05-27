namespace QuoteQuiz.Api.Data.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public ICollection<QuizGame> QuizGames { get; set; } = new List<QuizGame>();
    }
}
