import io
import qrcode
import asyncio
import websockets
from pynput.keyboard import Controller, Key

keyboard = Controller()
ipdir = "192.168.0.106"
port = 8080

key_map = {
    "accelerator": "w",
    "brake": "s",
    "left": "a",
    "right": "d",
    "raccelerator": Key.space,
}

currentDirection = None
currentPedal = None


async def press_key(key: str):
    key = str(key).lower()
    mapped_key = key_map.get(key, "")
    while True and mapped_key != "":
        keyboard.press(mapped_key)
        await asyncio.sleep(0.1)  # Agrega await aquí


def release_key(key: str):
    key = str(key).lower()
    mapped_key = key_map.get(key, "")
    if mapped_key != "":
        keyboard.release(mapped_key)


async def handler(websocket, path):
    print("Cliente conectado")
    currKey = None
    currDir = None
    try:
        pedalTask = None
        directionTask = None
        async for message in websocket:
            print(f"Mensaje recibido: {message}")
            message = str(message).lower()
            if "cancel" in message:
                splited = message.split("-")[0]
                if pedalTask:
                    pedalTask.cancel()
                    release_key(splited)
            else:
                if "brake" in message or "accelerator" in message:
                    if message != currKey:
                        if currKey:
                            release_key(currKey)
                        if pedalTask:
                            pedalTask.cancel()
                        currKey = message
                        pedalTask = asyncio.create_task(press_key(message))
                else:
                    if message != currDir:
                        if currDir:
                            release_key(currDir)
                        if directionTask:
                            directionTask.cancel()
                        currDir = message
                        directionTask = asyncio.create_task(press_key(currDir))

            print(f'pressed {key_map.get(message, "")}')

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
