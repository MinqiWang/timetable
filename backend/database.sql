create table event_ownership ( event_id int not null auto_increment,
	author_id int not null references user(id),
	primary key (event_id, author_id) );

create table timetable_event ( id int not null primary key auto_increment,
	event_id int not null,
	event_name VARCHAR(50) not null, event_has_detail boolean not null, 
	start_time VARCHAR(50) not null, length float not null, week_of VARCHAR(30) not null,
	day_of_the_week int not null, is_repeating boolean not null,
	CONSTRAINT fk_1 foreign key (event_id) references event_ownership(event_id) on delete cascade);

create table event_detail (id int not null primary key,
	text_content VARCHAR(300), media_content_urls VARCHAR(300), 
	place varchar(200) not null references place(name),
	CONSTRAINT fk_2 foreign key (id) references event_ownership(event_id) on delete cascade);

create table place (name varchar(200) not null primary key, 
	visit_count int not null);

create table group_event_invitation (event_id int not null,
	invitee int not null references user(id), has_accepted boolean,
	primary key (event_id, invitee),
	CONSTRAINT fk_3 foreign key (event_id) references event_ownership(event_id) on delete cascade);

create table comment (id int not null primary key auto_increment, 
	event_id int not null, content VARCHAR(300) not null, 
	created_at VARCHAR(50) not null,
	CONSTRAINT fk_4 foreign key (event_id) references event_ownership(event_id) on delete cascade);

create table user ( id int not null primary key auto_increment,
	facebook_id VARCHAR(20) not null);

create table user_info ( id int not null primary key references user(id), name VARCHAR(30) not null,
	avatarURL VARCHAR(100) not null);

create table friendship ( id_from int not null references user(id), 
	id_to int not null references user(id), has_accepted boolean,
	primary key (id_from, id_to));

create table obscured_event ( slot_id int not null, obscured_week VARCHAR(20) not null, 
	primary key (slot_id, obscured_week), 
	CONSTRAINT fk_5 foreign key (slot_id) references timetable_event(id) on delete cascade);


drop table event_detail;
drop table place;
drop table group_event_invitation;
drop table comment;
drop table user;
drop table user_info;
drop table friendship;
drop table obscured_event;
drop table timetable_event;
drop table event_ownership;


describe event_detail;
describe place;
describe group_event_invitation;
describe comment;
describe timetable_event;
describe user;
describe user_info;
describe event_ownership;
describe friendship;
describe obscured_event;