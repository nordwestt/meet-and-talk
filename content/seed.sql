-- Seed from current lib/data (as of initial Turso migration).
-- Safe to re-run after schema: deletes content rows then re-inserts.

PRAGMA foreign_keys = ON;

DELETE FROM event_organisers;
DELETE FROM organiser_cities;
DELETE FROM city_topics;
DELETE FROM city_organisers;
DELETE FROM press_mentions;
DELETE FROM faqs;
DELETE FROM testimonials;
DELETE FROM events;
DELETE FROM venues;
DELETE FROM cities;
DELETE FROM organisers;
DELETE FROM topics;

INSERT INTO topics (id, slug, name, tagline, description, icon, color, status) VALUES
  ('language-exchange', 'language-exchange', 'Language Exchange', 'Practice languages over a drink',
   'Our flagship. Meet locals and internationals to practice languages in a relaxed, no-pressure setting. Swap tables, swap tongues, make friends.',
   'MessagesSquare', 'var(--chart-1)', 'live'),
  ('startups', 'startups-entrepreneurship', 'Startups & Entrepreneurship', 'Founders, builders & dreamers',
   'Trade ideas, find co-founders, and swap war stories with local founders and creative builders over coffee or a cold one.',
   'Rocket', 'var(--chart-2)', 'soon'),
  ('travel-culture', 'travel-culture', 'Travel & Culture', 'Stories from the road',
   'For the curious and the nomadic. Share travel tales, cultural quirks, and hidden gems from around the world.',
   'Globe2', 'var(--chart-4)', 'soon'),
  ('books', 'books', 'Books', 'Readers unite',
   'A friendly book circle for people who love to read and to talk about what they read — across genres and languages.',
   'BookOpen', 'var(--chart-5)', 'soon'),
  ('ai-tech', 'ai-technology', 'AI & Technology', 'Nerd out, in good company',
   'From machine learning to the latest gadgets — a space for tech-curious minds to meet, demo and debate.',
   'Cpu', 'var(--chart-2)', 'soon'),
  ('networking', 'networking', 'Networking', 'Real connections, no lanyards',
   'Meet people across industries in a warm, human way. Career moves start with a good conversation.',
   'Handshake', 'var(--chart-1)', 'soon'),
  ('board-games', 'board-games', 'Board Games', 'Roll the dice, meet the table',
   'Casual games nights that break the ice fast. Bring a game or learn a new one with the group.',
   'Dices', 'var(--chart-4)', 'soon'),
  ('photography', 'photography', 'Photography', 'Photo walks & good light',
   'Explore the city through a lens with fellow photographers, from phone shooters to film purists.',
   'Camera', 'var(--chart-5)', 'soon');

INSERT INTO organisers (id, name, role, bio, avatar, social) VALUES
  ('gabriele', 'Gabriele', 'City lead · Trento',
   'Born and raised in Trentino. Started Meet & Talk here and believes the best idea and the best way to learn languages is with good company and an aperitivo.',
   '/images/people/gabriele.png', '[]'),
  ('sofia', 'Sofia Lindqvist', 'City lead · Copenhagen',
   'Swedish-Danish, fluent in four languages and always hunting for the coziest bars in town.',
   '/images/people/sofia.svg',
   '[{"platform":"instagram","url":"https://instagram.com/","handle":"@sofia.talks"}]'),
  ('noah', 'Noah Andersen', 'Co-organiser · Copenhagen',
   'The friendly face at the door making sure nobody stands alone.',
   '/images/people/noah.svg', NULL);

INSERT INTO cities (id, slug, name, country, country_flag, description, status, image, gallery, member_count, social, timezone) VALUES
  ('trento', 'trento', 'Trento', 'Italy', '🇮🇹',
   'Where Meet & Talk began — a welcoming crowd of locals and internationals practising languages over aperitivo in the Dolomites’ gateway city.',
   'live', '/images/cities/trento.png',
   '["/images/community/trento-1.png","/images/community/trento-2.png"]',
   515,
   '[{"platform":"whatsapp","url":"https://chat.whatsapp.com/HTTpyIo9nfxKP9wMpUWd1D","handle":"WhatsApp Trento"},{"platform":"instagram","url":"https://www.instagram.com/meetandtalk.trento","handle":"meetandtalk.trento"}]',
   'CET'),
  ('copenhagen', 'copenhagen', 'Copenhagen', 'Denmark', '🇩🇰',
   'Hygge meets hello — cozy bars, warm people, and dozens of languages around every table in our Danish home.',
   'live', '/images/cities/copenhagen.png',
   '["/images/community/community-1.png","/images/community/community-2.png","/images/community/community-3.svg"]',
   34,
   '[{"platform":"whatsapp","url":"https://chat.whatsapp.com/LZ1QrUMUyE3BzI1QTqzhGp","handle":"WhatsApp Copenhagen"},{"platform":"instagram","url":"https://instagram.com/","handle":"@meetandtalk.cph"},{"platform":"telegram","url":"https://t.me/","handle":"@meetandtalkcph"}]',
   'CET'),
  ('bolzano', 'bolzano', 'Bolzano', 'Italy', '🇮🇹',
   'We’re building interest for a Bolzano language exchange — join the waitlist and be first to know when we launch.',
   'planned', '/images/cities/bolzano.png', NULL, NULL,
   '[{"platform":"whatsapp","url":"https://chat.whatsapp.com/meetandtalk-bolzano-waitlist","handle":"Bolzano waitlist"}]',
   'CET'),
  ('verona', 'verona', 'Verona', 'Italy', '🇮🇹',
   'We’re building interest for a Verona language exchange — join the waitlist and be first to know when we launch.',
   'planned', '/images/cities/verona.png', NULL, NULL,
   '[{"platform":"whatsapp","url":"https://chat.whatsapp.com/meetandtalk-verona-waitlist","handle":"Verona waitlist"}]',
   'CET'),
  ('padova', 'padova', 'Padova', 'Italy', '🇮🇹',
   'We’re building interest for a Padova language exchange — join the waitlist and be first to know when we launch.',
   'planned', '/images/cities/padova.png', NULL, NULL,
   '[{"platform":"whatsapp","url":"https://chat.whatsapp.com/meetandtalk-padova-waitlist","handle":"Padova waitlist"}]',
   'CET');

INSERT INTO venues (id, name, city_id, address, description, capacity, image) VALUES
  ('green-bar-trento-centro', 'Green Bar', 'trento',
   'Via Gocciadoro, 44, 38122 Trento TN',
   'A green bar — our first home for Meet & Talk.', 70, '/images/venues/green-bar.png'),
  ('the-living-room-cph', 'Paludan Bog&Café', 'copenhagen',
   'Fiolstraede 10-12, Copenhagen, DK',
   'A candle-lit café-bar with sofas made for long conversations.', 120, '/images/venues/paludan.png');

INSERT INTO events (id, slug, title, city_id, venue_id, topic_id, languages, date, time, recurring, description, capacity, going, image, price) VALUES
  ('cph-lang-tue', 'copenhagen-language-exchange-tuesday', 'Wednesday Language Exchange',
   'copenhagen', 'the-living-room-cph', 'language-exchange',
   '[{"code":"en","label":"English"},{"code":"it","label":"Italian"},{"code":"da","label":"Danish"},{"code":"es","label":"Spanish"},{"code":"de","label":"German"},{"code":"fr","label":"French"}]',
   '2026-07-22', '18:30', 'Wednesday',
   'Grab a name tag, find a table by language level, and switch every 20 minutes. Newcomers always welcome.',
   60, 47, '/images/community/community-1.png', 'Free'),
  ('tre-lang-tue', 'trento-language-exchange-tuesday', 'Tuesday Travel and Culture',
   'trento', 'green-bar-trento-centro', 'travel-culture',
   '[{"code":"en","label":"English"},{"code":"it","label":"Italian"},{"code":"da","label":"Danish"},{"code":"es","label":"Spanish"},{"code":"de","label":"German"},{"code":"fr","label":"French"}]',
   '2026-07-28', '18:30', 'Tuesday',
   'Grab a name tag, find a table by language level, and switch every 20 minutes. Newcomers always welcome.',
   60, 54, '/images/community/community-2.png', 'Free'),
  ('cph-lang-fri', 'copenhagen-language-exchange-tuesday', 'Friday Language Exchange',
   'copenhagen', 'the-living-room-cph', 'language-exchange',
   '[{"code":"en","label":"English"},{"code":"it","label":"Italian"},{"code":"da","label":"Danish"},{"code":"es","label":"Spanish"},{"code":"de","label":"German"},{"code":"fr","label":"French"}]',
   '2026-07-24', '18:30', 'Friday',
   'Grab a name tag, find a table by language level, and switch every 20 minutes. Newcomers always welcome.',
   60, 31, '/images/venues/paludan.png', 'Free');

INSERT INTO testimonials (id, quote, name, role, city_id, avatar) VALUES
  ('t1',
   'I moved to Trento not knowing a soul. A few months of Meet & Talk later, these are my closest friends.',
   'Thomas', 'Expat', 'trento', '/images/people/sofia.svg'),
  ('t2',
   'My English went from shy to confident, and I got a spritz out of every lesson. This is where Meet & Talk started for me.',
   'Giulia', 'Trento regular', 'trento', '/images/people/camille.svg');

INSERT INTO faqs (id, question, answer, sort_order) VALUES
  ('f1', 'Is it really free?',
   'Yes. Joining a Meet & Talk event is always free. You only pay for whatever you choose to eat or drink at the venue.', 1),
  ('f2', 'Do I need to speak the language well?',
   'Not at all. We have tables for every level, from absolute beginner to fluent. The only requirement is a willingness to say hello.', 2),
  ('f3', 'How do I join?',
   'Pick your city, join the WhatsApp group, and just show up to the next event. There’s no sign-up form or membership card.', 3),
  ('f4', 'What if there is no Meet & Talk in my city?',
   'Check our planned cities — you can join the WhatsApp waitlist to stay updated. Or request your city and we’ll gauge interest together.', 4),
  ('f5', 'I own a bar or café. How does hosting work?',
   'You give us a corner and a regular slot; we bring a friendly, thirsty crowd. There’s no cost and almost no effort on your side. Head to the For Venues page to request hosting.', 5),
  ('f6', 'Is Meet & Talk only about languages?',
   'Right now we focus on language exchange — it’s what we do best. More topics like startups, travel and books are on the horizon as the community grows.', 6);

INSERT INTO press_mentions (id, title, excerpt, url, outlet, author, date, city_id) VALUES
  ('sanbaradio-trento-2026',
   'Meet & Talk a Trento: è arrivato il Language Aperitivo!',
   'Katia Divina writes about finally finding an informal place in Trento to meet people and practice English and German — born from the idea of Gabriele Casagranda and Paolo Pelizzari.',
   'https://www.sanbaradio.it/meet-and-talk-trento/',
   'SanbaRadio', 'Katia Divina', '2026-05-04', 'trento');

INSERT INTO city_organisers (city_id, organiser_id) VALUES
  ('trento', 'gabriele'),
  ('copenhagen', 'gabriele');

INSERT INTO city_topics (city_id, topic_id) VALUES
  ('trento', 'language-exchange'),
  ('copenhagen', 'language-exchange'),
  ('bolzano', 'language-exchange'),
  ('verona', 'language-exchange'),
  ('padova', 'language-exchange');

INSERT INTO organiser_cities (organiser_id, city_id) VALUES
  ('gabriele', 'trento'),
  ('sofia', 'copenhagen'),
  ('noah', 'copenhagen');

INSERT INTO event_organisers (event_id, organiser_id) VALUES
  ('cph-lang-tue', 'gabriele'),
  ('tre-lang-tue', 'gabriele'),
  ('cph-lang-fri', 'gabriele');
