namespace QuoteQuiz.Api.DTOs
{
    public class QuestionDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Answers { get; set; } = string.Empty; // comma-separated
        public string CorrectAnswer { get; set; } = string.Empty;
    }
}
