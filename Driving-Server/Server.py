import asyncio
import websockets
import io
import qrcode

ipdir = "192.168.0.106"
port = 8080


async def handler(websocket, path):
    print("Cliente conectado")
    try:
        async for message in websocket:
            print(f"Mensaje recibido: {message}")
            # Procesa el mensaje y responde si es necesario
            await websocket.send(f"Echo: {message}")
    except websockets.exceptions.ConnectionClosed:
        print("Cliente desconectado")


start_server = websockets.serve(handler, ipdir, port)

print(f"Servidor WebSocket iniciado en ws://{ipdir}:{port}")
qr = qrcode.QRCode()
qr.add_data(f"{ipdir}:{port}")
f = io.StringIO()
qr.print_ascii(out=f)
f.seek(0)
print(f.read())
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
