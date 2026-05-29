using FluentValidation;
using QuoteQuiz.Api.DTOs;

namespace QuoteQuiz.Api.Validators
{
    public class CreateQuoteDtoValidator : AbstractValidator<CreateQuoteDto>
    {
        public CreateQuoteDtoValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Quote text is required.")
                .MinimumLength(10).WithMessage("Quote text must be at least 10 characters.")
                .MaximumLength(1000).WithMessage("Quote text cannot exceed 1000 characters.");

            RuleFor(x => x.Author)
                .NotEmpty().WithMessage("Author is required.")
                .MinimumLength(2).WithMessage("Author name must be at least 2 characters.")
                .MaximumLength(200).WithMessage("Author name cannot exceed 200 characters.");
        }
    }
}
