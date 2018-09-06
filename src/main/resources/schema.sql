drop table if exists todo;
create table todo (
  id int primary key auto_increment not null,
  task varchar(256) not null,
  assigned TIMESTAMP not null,
  completed TIMESTAMP null
);