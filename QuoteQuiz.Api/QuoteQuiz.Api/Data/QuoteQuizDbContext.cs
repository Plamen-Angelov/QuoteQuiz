using Microsoft.EntityFrameworkCore;
using QuoteQuiz.Api.Data.Models;

namespace QuoteQuiz.Api.Data
{
    public class QuoteQuizDbContext : DbContext
    {
        public QuoteQuizDbContext(DbContextOptions<QuoteQuizDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<QuizGame> QuizGames { get; set; }
        public DbSet<QuizAnswer> QuizAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);

            // Quote configuration
            modelBuilder.Entity<Quote>()
                .HasKey(q => q.Id);

            modelBuilder.Entity<Quote>()
                .Property(q => q.Text)
                .IsRequired()
                .HasMaxLength(1000);

            modelBuilder.Entity<Quote>()
                .Property(q => q.Author)
                .IsRequired()
                .HasMaxLength(200);

            // QuizGame configuration
            modelBuilder.Entity<QuizGame>()
                .HasKey(qg => qg.Id);

            modelBuilder.Entity<QuizGame>()
                .HasOne(qg => qg.User)
                .WithMany(u => u.QuizGames)
                .HasForeignKey(qg => qg.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // QuizAnswer configuration
            modelBuilder.Entity<QuizAnswer>()
                .HasKey(qa => qa.Id);

            modelBuilder.Entity<QuizAnswer>()
                .HasOne(qa => qa.QuizGame)
                .WithMany(qg => qg.QuizAnswers)
                .HasForeignKey(qa => qa.QuizGameId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<QuizAnswer>()
                .HasOne(qa => qa.Quote)
                .WithMany(q => q.QuizAnswers)
                .HasForeignKey(qa => qa.QuoteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<QuizAnswer>()
                .Property(qa => qa.SelectedAnswer)
                .IsRequired()
                .HasMaxLength(200);

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var seedDate = new DateTime(2024, 5, 28, 0, 0, 0, DateTimeKind.Utc);

            // Seed users
            modelBuilder.Entity<User>().HasData(
                new User { Id = Guid.Parse("a3ee8240-662c-4c49-b9fd-da879be07766"), Username = "john_doe", Email = "john@example.com", CreatedAt = seedDate, IsActive = true },
                new User { Id = Guid.Parse("d3844151-b0ed-45cc-a8ee-b0c2de699fa8"), Username = "jane_smith", Email = "jane@example.com", CreatedAt = seedDate, IsActive = true },
                new User { Id = Guid.Parse("9beb8c94-3a41-408d-8572-696d3daa0289"), Username = "bob_wilson", Email = "bob@example.com", CreatedAt = seedDate, IsActive = true }
            );

            // Seed quotes
            modelBuilder.Entity<Quote>().HasData(
                new Quote { Id = Guid.Parse("b7c8e4a1-2f3e-4c5d-9a8f-1b2c3d4e5f6a"), Text = "The only way to do great work is to love what you do.", Author = "Steve Jobs", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("c9d7f5b2-3a4f-5d6e-8b9c-2c3d4e5f6a7b"), Text = "Innovation distinguishes between a leader and a follower.", Author = "Steve Jobs", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("d8e6a4c3-4b5a-6e7f-7c8a-3d4e5f6a7b8c"), Text = "Life is what happens when you're busy making other plans.", Author = "John Lennon", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("e7f5b3d4-5c6a-7f8a-6d9b-4e5f6a7b8c9d"), Text = "The future belongs to those who believe in the beauty of their dreams.", Author = "Eleanor Roosevelt", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("f6a4c2e5-6d7a-8a9b-5e0c-5f6a7b8c9d0e"), Text = "It is during our darkest moments that we must focus to see the light.", Author = "Aristotle", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("a5b3d1e6-7e8a-9b0c-4f1a-6a7b8c9d0e1f"), Text = "The way to get started is to quit talking and begin doing.", Author = "Walt Disney", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("b4c2e0f7-8f9a-0c1b-3a2b-7b8c9d0e1f2a"), Text = "Don't let yesterday take up too much of today.", Author = "Will Rogers", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("c3d1f9a8-9a0b-1d2c-2b3c-8c9d0e1f2a3b"), Text = "You learn more from failure than from success.", Author = "Unknown", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("d2e0a8b9-0b1c-2e3a-1c4b-9d0e1f2a3b4c"), Text = "It's not whether you get knocked down, it's whether you get up.", Author = "Vince Lombardi", CreatedAt = seedDate },
                new Quote { Id = Guid.Parse("e1f9b7ca-1c2a-3f4b-0d5a-0e1f2a3b4c5d"), Text = "The only impossible journey is the one you never begin.", Author = "Tony Robbins", CreatedAt = seedDate }
            );
        }
    }
}
