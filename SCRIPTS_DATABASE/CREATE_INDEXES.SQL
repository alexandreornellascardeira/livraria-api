
create unique index uk_clientes_email on clientes(email);

create unique index uk_autores_email on autores(email);

create unique index uk_livro on livros(autor_id, nome);
