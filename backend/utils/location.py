def get_agro_zone(lat, lon):
    # Mapping logic for Indian Agro-climatic zones
    # Simplified mock mapping
    if 8.0 <= lat <= 37.0 and 68.0 <= lon <= 97.0:
        if lat > 28: return "Himalayan Region", "Clayey"
        if lat < 15: return "Coastal Region", "Sandy/Alluvial"
        return "Central Plateau", "Black/Red Soil"
    return "Unknown", "General"

def get_weather_mock(lat, lon):
    return {
        "temp": 28.5,
        "humidity": 65,
        "rainfall": 120,
        "description": "Partly Cloudy"
    }
