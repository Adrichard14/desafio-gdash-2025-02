import schedule
import json
import time
from datetime import datetime

from rabbitmq_client import getConnection

from google import genai


def retrieveOpenMeteoData():
    import requests
    lat = -10.9167
    lon = -37.0667

    url = "https://api.open-meteo.com/v1/forecast"
    today = datetime.today().date()

    start_date = today.strftime("%Y-%m-%d")
    end_date = today.strftime("%Y-%m-%d")
    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": True,
        "timezone": "auto",
        "hourly": "uv_index,temperature_2m,precipitation_probability,relative_humidity_2m",
        "start_date": start_date,
        "end_date": end_date
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

    data["location"] = {
        "city": city,
        "state": state,
        "country": country
    }

    message = {
        "weatherData": data,
    }

    channel, connection = getConnection()

    channel.basic_publish(
        exchange='',
        routing_key='weather_queue',
        body=json.dumps(message)
    )
    print('Message successfully sent to the queue')
    connection.close()


schedule.every(3).minutes.do(retrieveOpenMeteoData)
retrieveOpenMeteoData()

while 1:
    schedule.run_pending()
    time.sleep(1)


# asyncio.run(retrieveOpenMeteoData())

# getGeminiaiRecommendation()
