from threading import Thread
import asyncio
import nats
import os
import face_recognition
import cv2
import numpy as np
import json
nats_url = os.environ.get('NATS_URL', 'nats://localhost:4222')


async def main():
    nc = await nats.connect(nats_url)

    def message_handler(msg):
        id = msg.subject.split('.')[2]
        buf = np.ndarray(shape=(1, len(msg.data)),
                         dtype=np.uint8, buffer=msg.data)
        img = cv2.imdecode(buf, flags=1)
        encodings = face_recognition.face_encodings(img)

        for face_encoding in encodings:
            event = {
                "encodings": face_encoding.tolist(),
                "id": id
            }

            data = bytes(json.dumps(event).encode('utf-8'))

            asyncio.run(nc.publish('recognition.face.encodings', data))

            if msg.reply:
                asyncio.run(nc.publish(msg.reply, data))
        print("Received a frame on "+msg.subject+" "+str(len(encodings)))

    async def thread_message_handler(msg):
        thread = Thread(target=message_handler, args=(msg,))
        thread.start()

    await nc.subscribe("recognition.frame.*", cb=thread_message_handler)
    print('Subscribed')

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    try:
        loop.run_forever()
    finally:
        loop.close()
