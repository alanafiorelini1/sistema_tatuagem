# ============================================================
# seguranca.py — Verificação do token JWT
# Descrição: Função usada pelas rotas protegidas para conferir
#            se quem está fazendo a requisição tem um token válido.
# ============================================================

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITMO = os.getenv("ALGORITMO", "HS256")

# HTTPBearer() é o que faz o botão "Authorize" aparecer no /docs
esquema_token = HTTPBearer()
# Validação para impedir que o servidor suba sem a chave configurada
if not SECRET_KEY:
    raise ValueError(
        "A variável SECRET_KEY não foi configurada! "
        "Crie um arquivo .env baseado no .env.example."
    )

# "Segurança de porta" — confere se o token que veio na requisição é válido
def verificar_token(credenciais: HTTPAuthorizationCredentials = Depends(esquema_token)):
    token = credenciais.credentials   # o texto do token, sem a palavra "Bearer" na frente

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITMO])
        return payload   # se quiser, uma rota específica pode usar isso pra saber quem logou
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado, faça login de novo")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")