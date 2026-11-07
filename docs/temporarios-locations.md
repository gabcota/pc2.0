# API de locais exclusiva da temporarios

A página `/temporarios` usa `/api/temporarios/locais-prova/:cep`. O servidor consulta
`https://backend-api-map-production-7fef.up.railway.app` com o token de
`DELEGACIAS_API_TOKEN`, cadastrado em Secrets. Não configurar com prefixo `VITE_`,
não enviar ao navegador e não colocar em localStorage.

O caminho ativo consulta `/v1/delegacias` com raio 30000, limite 20 e fonte leste;
para resultados não vazios consulta `/v1/cep` e calcula distâncias em linha reta.
Endereço ausente aparece como “Endereço não informado”; coordenadas inválidas
geram erro explícito, sem fabricar distância. A precisão informada pelo provedor
é preservada nos dados salvos. A página mantém até três opções e o salvamento
existente do local, horário e candidatura.

Lista vazia, erro de serviço e falta de token não acionam Google ou CSV.
O caminho anterior `/api/locais-prova/:cep` está preservado integralmente.
Para retorno manual, restaurar somente a URL de busca da temporarios para esse
caminho anterior; não alterar as funções compartilhadas de Google.

`/agendamento-medico` continua usando `/api/locais-exame/:cep` e não foi alterado.
Não há migrações nem alterações de credenciais das outras integrações.

Antes de publicar, configurar o token no ambiente de destino e validar uma
consulta autenticada. O teste público `/saude` não comprova autenticação.
