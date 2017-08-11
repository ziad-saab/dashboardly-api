USE dashboardly;

INSERT INTO `users` (email, password) VALUES ('grandma@dashboard.com','cookies');
INSERT INTO `users`(email, password) VALUES ('grandpa@dashboard.com','cookies');

INSERT INTO `boards`(ownerId, title, description) VALUES (1, 'soaps', 'favourite shows');
INSERT INTO `boards`(ownerId, title, description) VALUES (2, 'matches', 'soccer matches');

INSERT INTO `bookmarks` (boardId, title, url) VALUES (1, 'got', 'http://www.hbo.com/game-of-thrones');
INSERT INTO `bookmarks` (boardId, title, url) VALUES (2, 'soccernews', 'http://www.skysports.com/football/news');

