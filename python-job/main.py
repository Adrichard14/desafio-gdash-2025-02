import asyncio
import schedule
import json
import time

from rabbitmq_client import getConnection

from google import genai


def retrieveOpenMeteoData():
    import requests
    lat = -10.9167
    lon = -37.0667

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": True,
        "hourly": "temperature_2m"
    }
    print('sending open meteo request')
    response = requests.get(url, params=params)
    data = response.json()

    geocode_url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&accept-language=pt"
    geo_resp = requests.get(geocode_url, headers={"User-Agent": "weather-app"})
    geo_data = geo_resp.json()

    address = geo_data.get("address", {})
    city = address.get("city") or address.get("town") or address.get("village")
    state = address.get("state")
    country = address.get("country")

    rawResponse = getGeminiaiRecommendation(data)

    recommendation_data = {"recommendation": rawResponse}

    data["location"] = {
        "city": city,
        "state": state,
        "country": country
    }

    message = {
        "weatherData": data,
        "recommendation": recommendation_data["recommendation"]
    }

    channel, connection = getConnection()

    channel.basic_publish(
        exchange='',
        routing_key='weather_queue',
        body=json.dumps(message)
    )
    print('Message successfully sent to the queue')
    connection.close()


def getGeminiaiRecommendation(weatherData):
    client = genai.Client(api_key="AIzaSyBhg8iWTyVz-Lp76clb_Ib6xyWv1L1MadU")

    prompt = f"""
        Você é um assistente especializado em clima e estilo de vida. 
        Com base nos seguintes dados meteorológicos retornados pela API Open-Meteo:

        {json.dumps(weatherData)}

        Gere recomendações, dicas práticas ou alertas relevantes para uma pessoa que está nessa região. 
        Considere um limite de 700 caracteres: a resposta deve ser objetiva e não muito longa. 
        Utilize emojis para deixar as respostas mais descontraídas.

        Responda SOMENTE com o texto puro, sem blocos de código, sem formatação markdown e sem explicações adicionais.
        """

    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt
    )
    return response.text


schedule.every(3).minutes.do(retrieveOpenMeteoData)
retrieveOpenMeteoData()

while 1:
    schedule.run_pending()
    time.sleep(1)


# asyncio.run(retrieveOpenMeteoData())

# getGeminiaiRecommendation()
