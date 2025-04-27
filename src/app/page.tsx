'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, RefreshCcw, Cloud, Wind } from "lucide-react"

interface DateTimeData {
  date: string
  time: string
}

interface WeatherData {
  temperature: number
  windspeed: number
  weathercode: number
}

export default function Home() {
  const [dateTime, setDateTime] = useState<DateTimeData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchDateTime = async () => {
    try {
      const response = await axios.get('https://api-data-hora-1-zkye.onrender.com/datetime')
      setDateTime(response.data)
    } catch (error) {
      console.error('Erro ao buscar data e hora:', error)
    }
  }

  const fetchWeather = async () => {
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true')
      setWeather(response.data.current_weather)
    } catch (error) {
      console.error('Erro ao buscar clima:', error)
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    await Promise.all([fetchDateTime(), fetchWeather()])
    setLoading(false)
  }

  useEffect(() => {
    handleUpdate()
  }, [])

  const weatherDescription = (code: number) => {
    switch (code) {
      case 0: return "Céu limpo";
      case 1: case 2: case 3: return "Parcialmente nublado";
      case 45: case 48: return "Nevoeiro";
      case 51: case 53: case 55: return "Garoa";
      case 61: case 63: case 65: return "Chuva";
      case 71: case 73: case 75: return "Neve";
      case 80: case 81: case 82: return "Pancadas de chuva";
      default: return "Clima desconhecido";
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-blue-300">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <Sun className="h-10 w-10 text-yellow-500" />
          <CardTitle>Previsão e Hora Atual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {dateTime && (
            <>
              <div className="text-3xl font-bold">{dateTime.date}</div>
              <div className="text-2xl text-gray-700">{dateTime.time}</div>
            </>
          )}
          {weather && (
            <div className="space-y-2">
              <div className="flex justify-center items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-500" />
                <span>Temperatura: {weather.temperature}°C</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Wind className="h-5 w-5 text-blue-700" />
                <span>Vento: {weather.windspeed} km/h</span>
              </div>
              <div className="text-gray-600">{weatherDescription(weather.weathercode)}</div>
            </div>
          )}
          <div className="flex justify-center">
          <Button onClick={handleUpdate} disabled={loading} className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            {loading ? "Atualizando..." : "Atualizar Dados"}
          </Button>
        </div>
        </CardContent>
      </Card>
    </main>
  )
}
