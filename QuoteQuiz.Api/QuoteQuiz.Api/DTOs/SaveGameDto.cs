namespace QuoteQuiz.Api.DTOs
{
    public class SaveGameDto
    {
        public Guid UserId { get; set; }
        public List<GameAnswerSubmissionDto> Answers { get; set; } = new();
    }

    public class GameAnswerSubmissionDto
    {
        public Guid QuoteId { get; set; }
        public string SelectedAnswer { get; set; } = string.Empty;
        public string SuggestedOptions { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
    }

    public class SaveGameResponseDto
    {
        public Guid Id { get; set; }
    }
}
