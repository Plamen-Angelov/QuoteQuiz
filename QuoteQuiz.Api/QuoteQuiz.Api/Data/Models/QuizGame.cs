namespace QuoteQuiz.Api.Data.Models
{
    public class QuizGame
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public int Score { get; set; } = 0;

        // Foreign key and navigation properties
        public User? User { get; set; }
        public ICollection<QuizAnswer> QuizAnswers { get; set; } = new List<QuizAnswer>();
    }
}
