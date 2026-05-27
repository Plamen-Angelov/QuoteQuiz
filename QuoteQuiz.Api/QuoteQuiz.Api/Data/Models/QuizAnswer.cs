namespace QuoteQuiz.Api.Data.Models
{
    public class QuizAnswer
    {
        public Guid Id { get; set; }
        public Guid QuizGameId { get; set; }
        public Guid QuoteId { get; set; }
        public string SelectedAnswer { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public DateTime AnsweredAt { get; set; }

        // Foreign key and navigation properties
        public QuizGame? QuizGame { get; set; }
        public Quote? Quote { get; set; }
    }
}
