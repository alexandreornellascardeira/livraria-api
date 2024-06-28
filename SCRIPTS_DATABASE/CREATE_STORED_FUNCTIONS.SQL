CREATE OR REPLACE FUNCTION getVendasByAutorId(p_autor_id INTEGER)
RETURNS TABLE (
  	venda_id integer,
	cliente_id integer,
	livro_id integer,
	valor numeric,
	data_venda date
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
  	v.venda_id ,
	v.cliente_id ,
	v.livro_id,
	v.valor ,
	v.data_venda 
  FROM livros l 
  INNER JOIN
  vendas v 
  ON 
  l.livro_id = v.livro_id
  WHERE 
    l.autor_id = p_autor_id
  ORDER BY
  	v.venda_id;
END;
$$ LANGUAGE plpgsql;




create or replace function getQtdVendasByClienteId(
   p_cliente_id integer
)
RETURNS integer
as
$func$

declare
   p_ret integer;

begin
  
  	select
  		count(*)
	into
		p_ret
	from
		vendas
	where
		cliente_id = p_cliente_id;


   return p_ret;

END
$func$ LANGUAGE plpgsql;


create or replace function getQtdLivrosByAutorId(
   p_autor_id integer
)
RETURNS integer
as
$func$


declare
   p_ret integer;

begin
  
  	select
  		count(*)
	into
		p_ret
	from
		livros
	where
		autor_id = p_autor_id;


   return p_ret;


END
$func$ LANGUAGE plpgsql;


create or replace function getQtdVendasByLivroId(
   p_livro_id integer
)
RETURNS integer
as
$func$


declare
   p_ret integer;

begin
  
  	select
  		count(*)
	into
		p_ret
	from
		vendas
	where
		livro_id = p_livro_id;


   return p_ret;

END
$func$ LANGUAGE plpgsql;


create or replace function getValorByLivroId(
   p_livro_id integer
)
RETURNS numeric
as
$func$

declare
   p_ret numeric;

begin
  
  	select
  		valor
	into
		p_ret
	from
		livros
	where
		livro_id = p_livro_id;

   return p_ret;

END
$func$ LANGUAGE plpgsql;
