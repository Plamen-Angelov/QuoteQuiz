using FluentValidation;
using QuoteQuiz.Api.Data.Models;
using QuoteQuiz.Api.Data.Repositories;
using QuoteQuiz.Api.DTOs;

namespace QuoteQuiz.Api.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IValidator<CreateUserDto> _createUserValidator;
        private readonly IValidator<UpdateUserDto> _updateUserValidator;

        public UserService(
            IUserRepository userRepository,
            IValidator<CreateUserDto> createUserValidator,
            IValidator<UpdateUserDto> updateUserValidator)
        {
            _userRepository = userRepository;
            _createUserValidator = createUserValidator;
            _updateUserValidator = updateUserValidator;
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null || user.IsDeleted)
                return null;

            return MapToDto(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Where(u => !u.IsDeleted).Select(MapToDto);
        }

        public async Task<PagedResultDto<UserDto>> GetUsersPagedAsync(string? searchText, int pageNumber, int pageSize, string sortBy = "CreatedAt", string sortDirection = "desc")
        {
            var (items, total) = await _userRepository.GetUsersPagedAsync(searchText, pageNumber, pageSize, sortBy, sortDirection);
            return new PagedResultDto<UserDto>
            {
                Items = items.Select(MapToDto),
                Total = total
            };
        }

        public async Task<IEnumerable<UserDto>> GetActiveUsersAsync()
        {
            var users = await _userRepository.GetActiveUsersAsync();
            return users.Select(MapToDto);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Validate
            var validationResult = await _createUserValidator.ValidateAsync(createUserDto);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            // Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(createUserDto.Email);
            if (existingUser != null)
                throw new InvalidOperationException("A user with this email already exists.");

            // Create new user
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                IsDeleted = false
            };

            await _userRepository.AddAsync(user);
            return MapToDto(user);
        }

        public async Task<UserDto> UpdateUserAsync(Guid id, UpdateUserDto updateUserDto)
        {
            // Validate
            var validationResult = await _updateUserValidator.ValidateAsync(updateUserDto);
            if (!validationResult.IsValid)
                throw new ValidationException(validationResult.Errors);

            var user = await _userRepository.GetByIdAsync(id);
            if (user == null || user.IsDeleted)
                throw new InvalidOperationException("User not found.");

            // Check if new email is already taken by another user
            if (user.Email != updateUserDto.Email)
            {
                var existingUser = await _userRepository.GetByEmailAsync(updateUserDto.Email);
                if (existingUser != null)
                    throw new InvalidOperationException("A user with this email already exists.");
            }

            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.IsActive = updateUserDto.IsActive;

            await _userRepository.UpdateAsync(user);
            return MapToDto(user);
        }

        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null || user.IsDeleted)
                throw new InvalidOperationException("User not found.");

            await _userRepository.SoftDeleteAsync(id);
        }

        private UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
