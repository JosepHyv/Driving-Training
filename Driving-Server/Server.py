import asyncio
import websockets


async def handler(websocket, path):
    print("Cliente conectado")
    try:
        async for message in websocket:
            print(f"Mensaje recibido: {message}")
            # Procesa el mensaje y responde si es necesario
            await websocket.send(f"Echo: {message}")
    except websockets.exceptions.ConnectionClosed:
        print("Cliente desconectado")


start_server = websockets.serve(handler, "192.168.0.106", 8080)

print("Servidor WebSocket iniciado en ws://192.168.0.106:8080")

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
