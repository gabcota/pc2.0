---
name: Alterações de preço no funil
description: Separar cotações novas de valores de Pix já emitidos ao alterar tickets.
---
Alterações de tickets valem para novas cobranças; Pix já emitidos devem continuar exibindo o valor original.

**Why:** O valor de um Pix emitido não muda junto com a cotação do site. Reutilizar uma cotação antiga para gerar outro Pix ou mostrar o novo preço sobre um Pix antigo cria divergências.

**How to apply:** Ao alterar preços, conferir servidor, valores de contingência e cotações salvas no navegador. Tratar o valor da transação emitida separadamente da cotação vigente.
