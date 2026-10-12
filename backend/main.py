from fastapi import FastAPI, Depends
from seguranca import verificar_token, verificar_admin
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from rotas import clientes, senioridade, tatuadores, agendamentos, estilos, usuarios, login
import os

import traceback
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

# Middleware global para capturar e imprimir todos os erros 500 no terminal
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print("\n" + "="*50)
    print(f"ERRO NA ROTA: {request.url}")
    traceback.print_exc()  # Mostra exatamente a linha e o motivo do erro
    print("="*50 + "\n")
    return JSONResponse(
        status_code=500,
        content={"message": f"Erro interno do servidor: {str(exc)}"}
    )

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(login.router, tags=["Login"])
app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuários"], dependencies=[Depends(verificar_admin)])
app.include_router(clientes.router, prefix="/clientes", tags=["Clientes"], dependencies=[Depends(verificar_token)])
app.include_router(senioridade.router, prefix="/senioridade", tags=["Senioridade"], dependencies=[Depends(verificar_token)])
app.include_router(estilos.router, prefix="/estilos", tags=["Estilos"], dependencies=[Depends(verificar_token)])
app.include_router(tatuadores.router, prefix="/tatuadores", tags=["Tatuadores"], dependencies=[Depends(verificar_token)])
app.include_router(agendamentos.router, prefix="/agendamentos", tags=["Agendamentos"], dependencies=[Depends(verificar_token)])


@app.get("/")
def inicio():
    return {"mensagem": "API do estúdio de tatuagem funcionando!"}
