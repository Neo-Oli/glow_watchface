#!/usr/bin/env bash
mkdir -p weather_icons

SIZE=32

# Number → icon mapping (with original names as comments)
declare -A MAP=(
    [1]="cloud"              # Cloudy
    [2]="rain"               # Shower
    [3]="snow"               # Snow shower
    [4]="sun"                # Sunny
    [5]="heavy_cloud"        # Overcast
    [6]="light_rain"         # Light rain
    [7]="snow"               # Light snow
    [8]="rain"               # Moderate rain
    [9]="snow"               # Moderate snow
    [10]="heavy_snow"        # Heavy snow
    [11]="rain"              # Heavy rain
    [12]="wind"              # Sandstorm
    [13]="sleet"             # Sleet
    [14]="fog"               # Fog
    [15]="fog"               # Haze
    [16]="thunderstorm"      # Thundershower
    [17]="snow"              # Snowstorm
    [18]="wind"              # Dust
    [19]="rain"              # Extraordinary rainstorm
    [20]="rain_snow"         # Rain with hail
    [21]="thunderstorm"      # Thundershowers with hail
    [22]="rain"              # Heavy rainstorm
    [23]="wind"              # Sand blowing
    [24]="wind"              # Strong sandstorm
    [25]="rain"              # Rainstorm
    [26]="cloud"             # Unknown weather
    [27]="cloud_moon"        # Cloudy at night
    [28]="rain"              # Shower at night
    [29]="clear_night"       # Clear night
)

for n in "${!MAP[@]}"; do
    key="${MAP[$n]}"
    glyph="$(icon "$key")"

    outfile="$(printf "%02d.png" "$n")"

    magick \
        -background none \
        -fill white \
        -font "$FONTFILE" \
        -pointsize "$SIZE" \
        label:"$glyph" \
        "weather_icons/$outfile"

    echo "Generated $outfile → $key ($glyph)"
done
