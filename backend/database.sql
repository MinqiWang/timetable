create table event (id int not null auto_increment, 
	name VARCHAR(50) not null, author VARCHAR(50), 
	text_content VARCHAR(300), media_content_urls VARCHAR(300), 
	place_pc varchar(10) not null references place(postal_code), 
	primary key(id));

create table place (postal_code varchar(10) not null primary key, 
	name varchar(200) not null, visit_count int not null);

create table group_event (id int not null primary key references event(id), 
	invitees varchar(2000), attendees varchar(2000));

create table comment (id int not null primary key auto_increment, 
	event_id int references event(id), author VARCHAR(50) not null, 
	content VARCHAR(300) not null, created_at VARCHAR(50) not null);

create table timetable (author VARCHAR(50) not null primary key, 
	event_id int not null references event(id), year int not null, 
	month int not null, day int not null, start_time VARCHAR(10), 
	end_time VARCHAR(10), day_of_the_week int not null);