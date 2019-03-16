create table event_detail (id int not null primary key references event_ownership(event_id),
	text_content VARCHAR(300), media_content_urls VARCHAR(300), 
	place varchar(200) not null references place(name));

create table place (name varchar(200) not null primary key, 
	visit_count int not null);

create table group_event_invitation (event_id int not null references event_ownership(event_id),
	invitee int not null references user(id), has_accepted boolean not null,
	primary key (event_id, invitee));

create table comment (id int not null primary key auto_increment, 
	event_id int references event_ownership(event_id), content VARCHAR(300) not null, 
	created_at VARCHAR(50) not null);

create table timetable_event ( id int not null primary key auto_increment,
	event_id int not null references event_ownership(event_id),
	event_name VARCHAR(50) not null, event_has_detail boolean not null, 
	start_time VARCHAR(50) not null, length float not null, week_of VARCHAR(30) not null,
	day_of_the_week int not null, is_repeating boolean not null, 
	obscured_by int not null references timetable_event(id),
	is_empty_obscure boolean not null);

create table user ( id int not null primary key auto_increment,
	facebook_id VARCHAR(20) not null);

create table event_ownership ( event_id int not null auto_increment,
	author_id int not null references user(id),
	primary key (event_id, author_id) );

create table friendship ( id_from int not null references user(id), 
	id_to int not null references user(id), has_accepted boolean not null,
	primary key (id_from, id_to));





drop table event_detail;
drop table place;
drop table group_event_invitation;
drop table comment;
drop table timetable_event;
drop table user;
drop table event_ownership;
drop table friendship;


describe event_detail;
describe place;
describe group_event_invitation;
describe comment;
describe timetable_event;
describe user;
describe event_ownership;
describe friendship;