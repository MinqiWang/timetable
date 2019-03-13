create table event_detail (id int not null primary key auto_increment,
	text_content VARCHAR(300), media_content_urls VARCHAR(300), 
	place varchar(200) not null references place(name));

create table place (name varchar(200) not null primary key, 
	visit_count int not null);

create table group_event (id int not null primary key references event(id), 
	invitees varchar(2000), attendees varchar(2000));

create table comment (id int not null primary key auto_increment, 
	event_id int references event(id), author VARCHAR(50) not null, 
	content VARCHAR(300) not null, created_at VARCHAR(50) not null);

create table timetable_event ( id int not null primary key auto_increment,
	event_id int not null references event(id),
	author VARCHAR(50) not null, event_name VARCHAR(50) not null,
	event_has_detail boolean not null, start_time VARCHAR(50) not null, 
	length float not null, week_of VARCHAR(30) not null,
	day_of_the_week int not null, is_repeating boolean not null, 
	obscured_by int not null references timetable_event(event_id),
	is_empty_obscure boolean not null);







drop table event_detail;
drop table place;
drop table group_event;
drop table comment;
drop table timetable_event;

describe event_detail;
describe place;
describe group_event;
describe comment;
describe timetable_event;