import pika


def getConnection():
    connection_params = pika.ConnectionParameters(
        host='localhost',
        port=5672,
        credentials=pika.PlainCredentials('guest', 'guest')
    )

    connection = pika.BlockingConnection(connection_params)
    channel = connection.channel()

    channel.queue_declare(queue='weather_queue')

    print("Connected to RabbitMQ and queue declared.")

    return channel, connection
