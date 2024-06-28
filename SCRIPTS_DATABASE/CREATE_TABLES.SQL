create table clientes(
	cliente_id SERIAL not null,
	nome VARCHAR(100) not null,  
	email VARCHAR(100) not null,
	senha VARCHAR(100) not null ,
	telefone VARCHAR(14) not null , 
	endereco VARCHAR(255) not null,
	cep char(8) null,
	createdAt timestamp with time zone  DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt timestamp with time zone,
	CONSTRAINT pk_clientes PRIMARY KEY (cliente_id)
);

create table autores(
	autor_id SERIAL not null, 
	nome VARCHAR(100) not null, 
	email VARCHAR(100) not null,
	telefone VARCHAR(14) not null,
	createdAt timestamp with time zone  DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt timestamp with time zone,
	CONSTRAINT pk_autores PRIMARY KEY (autor_id)
);

create table livros(
	livro_id SERIAL not null,
	autor_id integer not null,
	nome varchar(255) not null,
	valor NUMERIC not null, 
	estoque integer not null default 0,
	createdAt timestamp with time zone  DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt timestamp with time zone,
	CONSTRAINT pk_livros PRIMARY KEY (livro_id),
 	CONSTRAINT fk_autor FOREIGN KEY(autor_id) REFERENCES autores(autor_id)
);

create table vendas(
	venda_id SERIAL not null,
	cliente_id integer not null,
	livro_id integer not null,
	valor NUMERIC not null, 
	data_venda date not null,
	createdAt timestamp with time zone  DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updatedAt timestamp with time zone,
	CONSTRAINT pk_vendas PRIMARY KEY (venda_id),
 	CONSTRAINT fk_cliente FOREIGN KEY(cliente_id) REFERENCES clientes(cliente_id),
	CONSTRAINT fk_livro FOREIGN KEY(livro_id) REFERENCES livros(livro_id)
);
