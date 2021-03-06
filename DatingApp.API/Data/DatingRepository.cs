using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => 
                u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id , bool isCurrentUser)
        {
            var query = _context.Users.Include(p => p.Photos).AsQueryable();

            if(isCurrentUser)
                query = query.IgnoreQueryFilters();

            var user = await query.FirstOrDefaultAsync(u => u.Id == id);
            //var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);          

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParam userParam)
        {
            //var users = _context.Users.Include(p => p.Photos)
            //   .OrderByDescending(u => u.LastActive).AsQueryable();

            var users = _context.Users.OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.Id != userParam.UserId);

            users = users.Where(u => u.Gender == userParam.Gender);

            if(userParam.Likers)
            {
                var userLikers = await GetUserLike(userParam.UserId, userParam.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if(userParam.Likees)
            {
                var userLikees = await GetUserLike(userParam.UserId, userParam.Likers);                
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if(userParam.MinAge != 18 || userParam.MinAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParam.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParam.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if(!string.IsNullOrEmpty(userParam.OrderBy))
            {
                switch(userParam.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users,userParam.PageNumber, userParam.PageSize);
        }

        public async Task<IEnumerable<int>> GetUserLike(int id, bool Likers)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            //var user = await _context.Users.Include(x => x.Likers)
            //    .Include(x => x.Likees).FirstOrDefaultAsync(u => u.Id == id);

            if(Likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages.AsQueryable();
            //  var messages = _context.Messages
            //     .Include(u => u.Sender).ThenInclude(p => p.Photos)
            //     .Include(u => u.Recipient).ThenInclude(p => p.Photos) 
            //     .AsQueryable();

            switch(messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId
                        && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId
                        && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId 
                        && u.RecipientDeleted == false && u.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(d => d.MessageSent);
            return await PagedList<Message>.CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Where(m => m.RecipientId == userId && m.RecipientDeleted == false
                    && m.SenderId == recipientId
                    || m.RecipientId == recipientId && m.SenderId == userId
                    && m.SenderDeleted == false)
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

            //  var messages = await _context.Messages
            //     .Include(u => u.Sender).ThenInclude(p => p.Photos)
            //     .Include(u => u.Recipient).ThenInclude(p => p.Photos)
            //     .Where(m => m.RecipientId == userId && m.RecipientDeleted == false
            //         && m.SenderId == recipientId
            //         || m.RecipientId == recipientId && m.SenderId == userId
            //         && m.SenderDeleted == false)
            //     .OrderByDescending(m => m.MessageSent)
            //     .ToListAsync();

            return messages;
        }
    }
}