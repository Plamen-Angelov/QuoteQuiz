namespace QuoteQuiz.Api.DTOs
{
    public class QuoteDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
