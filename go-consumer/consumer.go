package main

import (
	"bytes"
	"golang-rabbitmq-consumer/rabbitmq"
	"log"
	"net/http"
	"time"
)

func sendToAPI(body []byte) bool {
	url := "http://localhost:3006/api/weather"
	maxRetries := 3
	for i := 0; i < maxRetries; i++ {
		req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))

		if err != nil {
			log.Printf("Error while creating request: %s", err)
			return false
		}
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Do(req)
		log.Printf("response: %s", resp)

		if err != nil {
			log.Printf("Error sending data do the API (try %d): %s", i+1, err)
			time.Sleep(2 * time.Second)
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusCreated {
			log.Println("Data successfully sent to the API")
			return true
		}
		time.Sleep(2 * time.Second)
	}
	return false
}

func main() {
	rabbitmq.NewRabbitMQConnection()
	defer rabbitmq.RabbitMQClient.CloseConnection()

	msgs, err := rabbitmq.RabbitMQClient.Channel.Consume(
		"weather_queue",
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Failed to consume RabbitMQ queue: %s", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			// fmt.Printf("Mensagem recebida: %s\n", d.Body)

			success := sendToAPI(d.Body)

			if success {
				d.Ack(false) // confirma que processou
			} else {
				d.Nack(false, true) // rejeita e requeue para tentar de novo
			}
		}
	}()

	log.Println("[*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
