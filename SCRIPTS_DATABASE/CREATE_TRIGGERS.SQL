CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedat = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER tgr_clientes_update
AFTER UPDATE ON clientes
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();



CREATE OR REPLACE FUNCTION atualiza_saldo_livro()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE livros
  SET estoque = estoque -  1 --NEW.qtd   
  FROM vendas
  WHERE vendas.livro_id = NEW.livro_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_atualiza_saldo_livro
AFTER INSERT ON vendas
FOR EACH ROW
EXECUTE PROCEDURE atualiza_saldo_livro();



CREATE OR REPLACE FUNCTION define_valor_venda()
RETURNS TRIGGER AS $$
DECLARE v_valor DECIMAL;
BEGIN
  

  SELECT valor 
  INTO v_valor
  FROM livros
  WHERE livros.livro_id = NEW.livro_id;

  IF FOUND THEN
    NEW.valor = v_valor;   
  ELSE
    RAISE EXCEPTION 'Livro ID % não localizado!', NEW.livro_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tgr_define_valor_venda
BEFORE INSERT ON vendas
FOR EACH ROW
EXECUTE PROCEDURE define_valor_venda();
