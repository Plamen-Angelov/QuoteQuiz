namespace QuoteQuiz.Api.DTOs
{
    public class UserGameHistoryDto
    {
        public Guid GameId { get; set; }
        public DateTime PlayedAt { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double AccuracyPercentage { get; set; }
        public List<GameQuestionAnswerDto> Questions { get; set; } = new();
    }

    public class GameQuestionAnswerDto
    {
        public Guid QuoteId { get; set; }
        public string QuoteText { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string SelectedAnswer { get; set; } = string.Empty;
        public string SuggestedOptions { get; set; } = string.Empty;
        public string CorrectAnswer { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }
}
