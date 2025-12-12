/*
 ** Watch_Face_Editor tool
 ** watchface js version v2.1.1
 ** Copyright © SashaCX75. All Rights Reserved
 */

try {
    ;(() => {
        //start of ignored block
        const __$$app$$__ = __$$hmAppManager$$__.currentApp
        function getApp() {
            return __$$app$$__.app
        }
        function getCurrentPage() {
            return __$$app$$__.current && __$$app$$__.current.module
        }
        const __$$module$$__ = __$$app$$__.current
        const h = new DeviceRuntimeCore.WidgetFactory(
            new DeviceRuntimeCore.HmDomApi(__$$app$$__, __$$module$$__),
        )
        const { px } = __$$app$$__.__globals__
        //const logger = Logger.getLogger('watchface_SashaCX75');
        const logger = DeviceRuntimeCore.HmLogger.getLogger(
            'watchface_SashaCX75',
        )

        const shorten = (str, n) => Array.from(str).slice(0, n).join('')

        const font = 'fonts/3270NerdFontMono-Regular.ttf'

        //dynamic modify start

        const weather_icons = [
            ' ', // 0 Cloudy
            ' ', // 1 Shower
            '󰖘 ', // 2 Snow shower
            '󰖙 ', // 3 Sunny
            ' ', // 4 Overcast
            '󰖗 ', // 5 Light rain
            '󰖘 ', // 6 Light snow
            ' ', // 7 Moderate rain
            '󰖘 ', // 8 Moderate snow
            '󰼶 ', // 9 Heavy snow
            ' ', // 10 Heavy rain
            ' ', // 11 Sandstorm
            ' ', // 12 Sleet
            '󰖑 ', // 13 Fog
            '󰖑 ', // 14 Haze
            ' ', // 15 Thundershower
            '󰖘 ', // 16 Snowstorm
            ' ', // 17 Dust
            ' ', // 18 Extraordinary rainstorm
            '󰙿 ', // 19 Rain with hail
            ' ', // 20 Thundershowers with hail
            ' ', // 21 Heavy rainstorm
            ' ', // 22 Sand blowing
            ' ', // 23 Strong sandstorm
            ' ', // 24 Rainstorm
            ' ', // 25 Unknown weather
            '󰼱 ', // 26 Cloudy at night
            ' ', // 27 Shower at night
            ' ', // 28 Clear night
        ]
        const clocks = [
            '󱑊',
            '󱐿',
            '󱑀',
            '󱑁',
            '󱑂',
            '󱑃',
            '󱑄',
            '󱑅',
            '󱑆',
            '󱑇',
            '󱑈',
            '󱑉',
        ]

        const icons = {
            disconnect: '󰂲',
            steps: '',
            heart: '󰋑',
            distance: '',
            sleep: '󰒲',
            mail: '󰇮',
            phone: '󰄜',
            play: '󰐊',
            prev: '󰒮',
            next: '󰒭',
            pause: '󰏤',
            close: '×',
            shuffle: '',
        }
        const iconSize = 50
        const circleRadius = 47
        const buttonImage = 'empty.png'
        const debugImage = 'debug.png'
        const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
        let normal_timerTimeUpdate = undefined
        let normal_timerUpdateSec = undefined
        let idle_timerTimeUpdate = undefined
        let weatherData
        let cityName
        const center = 233

        let overlay = ''

        let colorCache = ''
        const cacheText = [
            "$|^0123456789 _-.,:;`'% ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzäöüÄÖÜéè°\\/",
            weather_icons.join(''),
            clocks.join(''),
            Object.values(icons).join(''),
        ].join('')

        const statsSize = 24

        const findPhone = (watchButton) => {
            /*
             * hmApp.startApp({
             * url: 'FindPhoneScreen',
             * native: true,
             * })
             */
            phoneAction('press')
        }
        const phoneAction = (action) => {
            console.log(`DROIDDO: ${action}`)
        }
        const big = 30
        const small = 18
        let animationTimer
        const timeSize = 90
        const weatherGap = 30
        const weatherHeight = big
        let init = false
        let fgColor = 0xffff8c00
        let bgColor = 0xff000000
        let elementBgColor = 0xff333333
        let accentColor = 0xffff0000
        let accentBgColor = 0xff666666

        const ystart = 45
        const gap = 10

        const dateCoords = {
            x: 113,
            y: ystart,
            w: 230,
            h: 36,
        }
        const weatherPos = dateCoords.y + dateCoords.h + gap
        const timeCoords = {
            x: 35,
            y: weatherPos + weatherHeight + gap,
            w: 393,
            h: 80,
        }
        const cityNameCoords = {
            x: timeCoords.x,
            y: timeCoords.y + timeCoords.h + gap,
            w: timeCoords.w,
            h: 39,
        }
        const cityLength = 24
        let mediaPlaying = false
        const mediaCoords = {
            x: cityNameCoords.x,
            y: cityNameCoords.y + cityNameCoords.h + gap,
            w: cityNameCoords.w,
            h: 36,
        }
        const statsStart = mediaCoords.y + mediaCoords.h + gap
        let volume = 15

        const fontSizes = [iconSize, statsSize, timeSize, big, small]
        const statsWidth = 120

        const e = {}
        const s = {}
        const allElements = []
        let animation = []
        const addAnimation = (
            element,
            from,
            to,
            total,
            prop,
            type,
            template,
        ) => {
            animation.push({
                element,
                from,
                to,
                total,
                prop,
                type,
                template,
            })
        }

        let layers = []
        const bg = 0
        const widgetBg = 1
        const widgetContent = 2
        const buttons = 3
        const overlayBG = 4
        const overlayFG = 5
        const overlayButtons = 5
        const addSensor = (name, sensor) => {
            if (!s.hasOwnProperty(name)) {
                s[name] = hmSensor.createSensor(sensor)
                return true
            }
            return false
        }
        const addElement = (layer, func, props, name) => {
            if (!(layer in layers)) {
                layers[layer] = []
            }
            layers[layer].push({
                type: func,
                props: props,
                name: name,
            })
            if (name && !e.hasOwnProperty(name)) {
                e[name] = ''
            }
        }
        const prepareElements = () => {
            layers = []
        }
        const renderElements = () => {
            for (const widget of allElements) {
                hmUI.deleteWidget(widget)
            }
            for (const layer in layers) {
                for (element of layers[layer]) {
                    const { type, name, props } = element
                    const widget = hmUI.createWidget(type, props)
                    allElements.push(widget)
                    if (name) {
                        e[name] = widget
                    }
                }
            }
        }

        __$$module$$__.module = DeviceRuntimeCore.WatchFace({
            init_view() {
                //dynamic modify start
                addSensor('weather', hmSensor.id.WEATHER)
                weatherData = s.weather.getForecastWeather()
                if (addSensor('battery', hmSensor.id.BATTERY)) {
                    s.battery.addEventListener(
                        hmSensor.event.CHANGE,
                        function () {
                            scale_call()
                        },
                    )
                }
                addSensor('time', hmSensor.id.TIME)
                const screenType = hmSetting.getScreenType()
                function checkConnection() {
                    hmBle.removeListener()
                    hmBle.addListener(function (status) {
                        if (!status) {
                            hmUI.showToast({ text: 'connection lost' })
                            vibro(28)
                        }
                        if (status) {
                            hmUI.showToast({ text: 'connection restored' })
                            vibro(28)
                        }
                    })
                }

                const vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE)
                let timer_StopVibrate = null

                function vibro(scene = 25) {
                    let stopDelay = 50
                    stopVibro()
                    vibrate.stop()
                    vibrate.scene = scene
                    if (scene < 23 || scene > 25) stopDelay = 1300
                    vibrate.start()
                    if (scene !== 1)
                        timer_StopVibrate = timer.createTimer(
                            stopDelay,
                            3000,
                            stopVibro,
                            {},
                        )
                }

                function stopVibro() {
                    vibrate.stop()
                    if (timer_StopVibrate) timer.stopTimer(timer_StopVibrate)
                }
                const setOverlay = (newOverlay = '') => {
                    overlay = newOverlay
                    scale_call()
                    time_update(true, true)
                }
                const render = () => {
                    prepareElements()

                    const drawRect = (coords, name) => {
                        const { x, y, w, h } = coords
                        const gap = 3
                        addElement(
                            widgetBg,
                            hmUI.widget.FILL_RECT,
                            {
                                x: x - gap,
                                y: y - gap,
                                w: w + gap * 2,
                                h: h + gap * 2,
                                radius: 0,
                                color: elementBgColor,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            },
                            name,
                        )
                    }
                    let countStats = 0
                    const createStat = (name, icon, button) => {
                        const x = 280
                        const y = statsStart
                        drawRect({
                            w: statsWidth,
                            h: statsSize,
                            x: x,
                            y: y + statsSize * countStats,
                        })
                        addElement(widgetContent, hmUI.widget.TEXT, {
                            x: x,
                            y: y + statsSize * countStats,
                            w: statsWidth,
                            h: statsSize,
                            text_size: statsSize,
                            char_space: 0,
                            font: font,
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            text: icon,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                        addElement(
                            widgetContent,
                            hmUI.widget.TEXT,
                            {
                                x: x + 25,
                                y: y + statsSize * countStats,
                                w: statsWidth,
                                h: statsSize,
                                text_size: statsSize,
                                char_space: 0,
                                font: font,
                                color: fgColor,
                                line_space: 0,
                                align_v: hmUI.align.TOP,
                                text_style: hmUI.text_style.ELLIPSIS,
                                align_h: hmUI.align.LEFT,
                                text: 'Err',
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            },
                            name,
                        )
                        if (button) {
                            addElement(widgetContent, hmUI.widget.IMG_CLICK, {
                                x: x,
                                y: y + statsSize * countStats,
                                w: 200,
                                h: statsSize,
                                src: buttonImage,
                                type: button,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            })
                        }
                        countStats += 1
                    }

                    createStat('steps', icons.steps, hmUI.data_type.STEP)
                    createStat('distance', icons.distance, hmUI.data_type.STEP)
                    createStat('heart', icons.heart, hmUI.data_type.HEART)
                    createStat('sleep', icons.sleep, hmUI.data_type.SLEEP)

                    let circleCount = 0
                    const createCircle = (name, icon, button) => {
                        const center_x = 120
                        const center_y = statsStart + circleRadius
                        const gap = 103
                        const x = center_x + gap * circleCount
                        const y = center_y
                        addElement(widgetBg, hmUI.widget.CIRCLE, {
                            center_x: x,
                            center_y: y,
                            radius: circleRadius,
                            color: elementBgColor,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                        addElement(
                            widgetContent,
                            hmUI.widget.ARC_PROGRESS,
                            {
                                center_x: x,
                                center_y: y,
                                radius: circleRadius,
                                start_angle: 0,
                                end_angle: 360,
                                line_width: 5,
                                corner_flag: 3,
                                color: fgColor,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            },
                            `${name}Circle`,
                        )
                        addElement(
                            widgetContent,
                            hmUI.widget.TEXT,
                            {
                                x: x - circleRadius,
                                y: y - big / 2 + 5,
                                w: circleRadius * 2,
                                h: big,
                                text_size: big,
                                char_space: 0,
                                font: font,
                                color: fgColor,
                                line_space: 0,
                                align_v: hmUI.align.CENTER_V,
                                text_style: hmUI.text_style.ELLIPSIS,
                                align_h: hmUI.align.CENTER_H,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                                text: 'Err',
                            },
                            name,
                        )
                        addElement(
                            widgetContent,
                            hmUI.widget.TEXT,
                            {
                                x: x - circleRadius,
                                y: y - big / 2 - big + 5,
                                w: circleRadius * 2,
                                h: big,
                                text_size: big,
                                char_space: 0,
                                font: font,
                                color: accentColor,
                                line_space: 0,
                                align_v: hmUI.align.CENTER_V,
                                text_style: hmUI.text_style.ELLIPSIS,
                                align_h: hmUI.align.CENTER_H,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                                text: 'Err',
                            },
                            `${name}Icon`,
                        )
                        if (button) {
                            const x = center_x - circleRadius
                            const y = center_y - circleRadius
                            addElement(buttons, hmUI.widget.BUTTON, {
                                x: x + gap * circleCount,
                                y: y,
                                w: circleRadius * 2,
                                h: circleRadius * 2,
                                text: '',
                                color: fgColor,
                                click_func: button,
                                press_src: buttonImage,
                                normal_src: buttonImage,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            })
                        }
                        circleCount += 1
                    }

                    createCircle('battery', 'Err', () => {
                        setOverlay('controls')
                    })
                    createCircle('phoneBattery', icons.phone, () => {
                        setOverlay('volume')
                    })
                    const createButton = (c, func) => {
                        addElement(overlayButtons, hmUI.widget.BUTTON, {
                            h: c.radius,
                            w: c.radius,
                            color: fgColor,
                            normal_color: elementBgColor,
                            press_color: fgColor,
                            ...c,
                            click_func: () => {
                                func()
                            },
                        })
                    }
                    const createArcControl = (name, initialLevel, func) => {
                        const lineWidth = 70
                        const radius = 233
                        addElement(overlayBG, hmUI.widget.CIRCLE, {
                            center_x: center,
                            center_y: center,
                            radius: radius,
                            color: bgColor,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                        addElement(
                            overlayBG,
                            hmUI.widget.ARC_PROGRESS,
                            {
                                center_x: center,
                                center_y: center,
                                start_angle: 0,
                                end_angle: 360,
                                level: 100,
                                radius: radius - lineWidth / 2,
                                line_width: lineWidth,
                                color: accentBgColor,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            },
                            `${name}ArcBg`,
                        )
                        addElement(
                            overlayFG,
                            hmUI.widget.ARC_PROGRESS,
                            {
                                center_x: center,
                                center_y: center,
                                start_angle: 0,
                                end_angle: 360,
                                level: initialLevel,
                                radius: radius - lineWidth / 2,
                                line_width: lineWidth,
                                color: accentColor,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            },
                            `${name}Arc`,
                        )
                        const numButtons = 15
                        const angleStep = 360 / numButtons // degrees
                        const offsetDeg = -80

                        for (let i = 0; i < numButtons; i++) {
                            const angleDeg = i * angleStep + offsetDeg
                            const angleRad = (angleDeg * Math.PI) / 180 // convert to radians

                            const x =
                                center +
                                (radius - lineWidth / 2) * Math.cos(angleRad)
                            const y =
                                center +
                                (radius - lineWidth / 2) * Math.sin(angleRad)
                            const newLevel = Math.round(
                                (100 / (numButtons - 1)) * i,
                            )
                            addElement(
                                overlayButtons,
                                hmUI.widget.BUTTON,
                                {
                                    x: x - lineWidth / 2,
                                    y: y - lineWidth / 2,
                                    w: lineWidth,
                                    h: lineWidth,
                                    color: fgColor,
                                    text_size: big,
                                    press_src: buttonImage,
                                    normal_src: buttonImage,
                                    text: `${newLevel}`,
                                    click_func: () => {
                                        func(newLevel)
                                        e[`${name}Arc`].setProperty(
                                            hmUI.prop.MORE,
                                            {
                                                level: newLevel,
                                                radius: radius - lineWidth / 2,
                                            },
                                        )
                                    },
                                },
                                `${name}Button${i}`,
                            )
                        }
                        const buttonRadius = 200
                        createButton(
                            {
                                text_size: timeSize,
                                text: icons.close,
                                radius: buttonRadius,
                                x: center - buttonRadius / 2,
                                y: center - buttonRadius / 2,
                            },
                            () => {
                                console.log('closing overlay')
                                setOverlay()
                            },
                        )
                    }
                    if (overlay === 'volume') {
                        createArcControl('volume', volume, (level) => {
                            phoneAction(`volume ${level}`)
                        })
                    }
                    const createControls = (buttons) => {
                        addElement(overlayBG, hmUI.widget.CIRCLE, {
                            center_x: center,
                            center_y: center,
                            radius: 220,
                            color: bgColor,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                        const buttonSize = circleRadius * 2
                        let y = 35
                        createButton(
                            {
                                text_size: big,
                                text: icons.close,
                                radius: buttonSize / 2,
                                x: center - buttonSize / 4,
                                y: y,
                            },
                            () => {
                                console.log('closing overlay')
                                setOverlay()
                            },
                        )
                        const startX = center - buttonSize * 1.5 - gap
                        let x = startX
                        y += gap + buttonSize / 2
                        let count = 0
                        const split = 3
                        for (const button of buttons) {
                            createButton(
                                {
                                    text_size: button.icon ? iconSize : small,
                                    text: button.text.replace(/ /g, '\n'),
                                    radius: buttonSize,
                                    font: font,
                                    x: x,
                                    y: y,
                                },
                                () => {
                                    console.log('running button')
                                    button.func()
                                },
                            )
                            count += 1
                            if (count % split === 0) {
                                x = startX
                                y += gap + buttonSize
                            } else {
                                x += gap + buttonSize
                            }
                        }
                    }
                    if (overlay === 'controls') {
                        createControls([
                            {
                                text: 'clear snoozed alarms',
                                func: () => {
                                    phoneAction('clearSnoozedAlarms')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'dnd',
                                func: () => {
                                    phoneAction('dnd')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'find my device',
                                func: () => {
                                    phoneAction('findMyDevice')
                                    setOverlay()
                                },
                            },
                            {
                                text: icons.prev,
                                icon: true,
                                func: () => {
                                    phoneAction('prev')
                                },
                            },
                            {
                                text: mediaPlaying ? icons.pause : icons.play,
                                icon: true,
                                func: () => {
                                    phoneAction('toggle')
                                },
                            },
                            {
                                text: icons.next,
                                icon: true,
                                func: () => {
                                    phoneAction('next')
                                },
                            },
                            {
                                text: icons.shuffle,
                                icon: true,
                                func: () => {
                                    phoneAction('random')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'volume',
                                func: () => {
                                    setOverlay('volume')
                                },
                            },
                            {
                                text: 'more',
                                func: () => {
                                    setOverlay('moreControls')
                                },
                            },
                        ])
                    }
                    if (overlay === 'moreControls') {
                        createControls([
                            {
                                text: 'back',
                                func: () => {
                                    setOverlay('controls')
                                },
                            },
                            {
                                text: 'fav',
                                func: () => {
                                    phoneAction('fav')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'search',
                                func: () => {
                                    phoneAction('search')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'player ctl',
                                func: () => {
                                    phoneAction('playerctl')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'screen share',
                                func: () => {
                                    phoneAction('screenshare')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'restart bt',
                                func: () => {
                                    phoneAction('restartBT')
                                    setOverlay()
                                },
                            },
                        ])
                    }

                    for (const size of fontSizes) {
                        addElement(bg, hmUI.widget.TEXT, {
                            x: 464,
                            y: 464,
                            w: 10000,
                            h: 22,
                            text_size: size,
                            char_space: 0,
                            line_space: 0,
                            font: font,
                            color: fgColor,
                            align_h: hmUI.align.LEFT,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            text: cacheText,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                    }
                    addElement(bg, hmUI.widget.FILL_RECT, {
                        x: 0,
                        y: 0,
                        w: 466,
                        h: 466,
                        color: bgColor,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(widgetContent, hmUI.widget.IMG_STATUS, {
                        x: 185,
                        y: 10,
                        src: buttonImage,
                        type: hmUI.system_status.DISTURB,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(widgetContent, hmUI.widget.TEXT, {
                        x: 220,
                        y: 10,
                        text: hmBle.connectStatus() ? '' : icons.disconnect,
                        type: hmUI.system_status.DISCONNECT,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                        w: 200,
                        h: 50,
                        text_size: iconSize,
                        char_space: 0,
                        font: font,
                        color: fgColor,
                        line_space: 0,
                        align_v: hmUI.align.CENTER_V,
                        align_h: hmUI.align.LEFT,
                        text_style: hmUI.text_style.NONE,
                        unit_type: 0,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    //weather
                    addElement(widgetContent, hmUI.widget.TEXT_FONT, {
                        x: 290,
                        y: weatherPos - 2,
                        w: 150,
                        h: 30,
                        text_size: small,
                        char_space: 0,
                        font: font,
                        color: fgColor,
                        line_space: 0,
                        align_v: hmUI.align.TOP,
                        text_style: hmUI.text_style.ELLIPSIS,
                        align_h: hmUI.align.LEFT,
                        type: hmUI.data_type.SUN_RISE,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(buttons, hmUI.widget.IMG_CLICK, {
                        x: 285,
                        y: 90,
                        w: 60,
                        h: 50,
                        src: buttonImage,
                        type: hmUI.data_type.SUN_CURRENT,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    addElement(widgetContent, hmUI.widget.TEXT_FONT, {
                        x: 290,
                        y: weatherPos + 12,
                        w: 150,
                        h: 30,
                        text_size: small,
                        char_space: 0,
                        font: font,
                        color: fgColor,
                        line_space: 0,
                        align_v: hmUI.align.TOP,
                        text_style: hmUI.text_style.ELLIPSIS,
                        align_h: hmUI.align.LEFT,
                        type: hmUI.data_type.SUN_SET,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    addElement(widgetContent, hmUI.widget.TEXT_FONT, {
                        x: 130,
                        y: weatherPos,
                        w: 150,
                        h: weatherHeight,
                        text_size: big,
                        char_space: 0,
                        font: font,
                        color: fgColor,
                        line_space: 0,
                        align_v: hmUI.align.CENTER_V,
                        text_style: hmUI.text_style.ELLIPSIS,
                        align_h: hmUI.align.RIGHT,
                        unit_type: 1,
                        type: hmUI.data_type.HUMIDITY,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    //date
                    drawRect(dateCoords)
                    addElement(
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...dateCoords,
                            text_size: big,
                            char_space: 0,
                            font: font,
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.CENTER_H,
                            // padding: true,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'date',
                    )
                    addElement(buttons, hmUI.widget.BUTTON, {
                        x: 100,
                        y: 40,
                        w: 260,
                        h: 50,
                        text: '',
                        color: fgColor,
                        text_size: big,
                        press_src: buttonImage,
                        normal_src: buttonImage,
                        click_func: (button_widget) => {
                            hmApp.startApp({
                                url: 'ScheduleCalScreen',
                                native: true,
                            })
                        },
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    addElement(
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            x: 170,
                            y: weatherPos - 10,
                            w: 200,
                            h: iconSize,
                            text_size: iconSize,
                            char_space: 0,
                            font: font,
                            color: accentColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            align_h: hmUI.align.LEFT,
                            text_style: hmUI.text_style.NONE,
                            unit_type: 0,
                            text: '',
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'condition',
                    )
                    //time
                    drawRect(timeCoords)
                    addElement(
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...timeCoords,
                            text_size: timeSize,
                            char_space: 0,
                            font: font,
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'time',
                    )
                    addElement(
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...timeCoords,
                            text_size: timeSize,
                            char_space: 0,
                            font: font,
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            /*
                             * padding: true,
                             * unit_type: 1,
                             * unit_end: 1,
                             */
                            show_level: hmUI.show_level.ONLY_AOD,
                        },
                        'aodTime',
                    )
                    addElement(buttons, hmUI.widget.IMG_CLICK, {
                        ...timeCoords,
                        src: buttonImage,
                        type: hmUI.data_type.COUNT_DOWN,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    addElement(
                        widgetContent,
                        hmUI.widget.ARC_PROGRESS,
                        {
                            center_x: center,
                            center_y: center,
                            start_angle: 0,
                            end_angle: 360,
                            radius: 231,
                            line_width: 5,
                            corner_flag: 3,
                            color: fgColor,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'secondCircle',
                    )

                    //city name
                    drawRect(cityNameCoords, 'cityBG')
                    addElement(
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...cityNameCoords,
                            w: 1000,
                            text_size: big,
                            char_space: 0,
                            font: font,
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'cityName',
                    )

                    //media
                    drawRect(mediaCoords, 'mediaBG')
                    addElement(
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...mediaCoords,
                            w: 1000,
                            text_size: big,
                            char_space: 0,
                            font: font,
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'media',
                    )
                    const mediaButtonWidth = 100
                    const mediaButtonHeight =
                        cityNameCoords.h + gap + mediaCoords.h
                    const mediaButtonY = cityNameCoords.y
                    /*
                     * addElement(buttons, hmUI.widget.BUTTON, {
                     * x: mediaCoords.x,
                     * y: mediaButtonY,
                     * w: mediaButtonWidth,
                     * h: mediaButtonHeight,
                     * text: '',
                     * color: fgColor,
                     * click_func: (watchface) => {
                     * phoneAction('prev')
                     * },
                     * press_src: buttonImage,
                     * normal_src: buttonImage,
                     * show_level: hmUI.show_level.ONLY_NORMAL,
                     * })
                     * addElement(buttons, hmUI.widget.BUTTON, {
                     * x:
                     * mediaCoords.x +
                     * mediaCoords.w / 2 -
                     * mediaButtonWidth / 2,
                     * y: mediaButtonY,
                     * w: mediaButtonWidth,
                     * h: mediaButtonHeight,
                     * text: '',
                     * color: fgColor,
                     * click_func: (watchface) => {
                     * phoneAction('toggle')
                     * },
                     * press_src: buttonImage,
                     * normal_src: buttonImage,
                     * show_level: hmUI.show_level.ONLY_NORMAL,
                     * })
                     * addElement(buttons, hmUI.widget.BUTTON, {
                     * x: mediaCoords.x + mediaCoords.w - mediaButtonWidth,
                     * y: mediaButtonY,
                     * w: mediaButtonWidth,
                     * h: mediaButtonHeight,
                     * text: '',
                     * color: fgColor,
                     * click_func: (watchface) => {
                     * phoneAction('next')
                     * },
                     * press_src: buttonImage,
                     * normal_src: buttonImage,
                     * show_level: hmUI.show_level.ONLY_NORMAL,
                     * })
                     * weather
                     */
                    const weatherStart = timeCoords.x + weatherGap
                    drawRect({
                        w: timeCoords.w - weatherGap * 2,
                        h: weatherHeight,
                        x: weatherStart,
                        y: weatherPos,
                    })
                    addElement(widgetContent, hmUI.widget.TEXT_FONT, {
                        x: weatherStart,
                        y: weatherPos,
                        w: 100,
                        h: weatherHeight,
                        text_size: big,
                        char_space: 0,
                        font: font,
                        color: fgColor,
                        line_space: 0,
                        align_v: hmUI.align.CENTER_V,
                        text_style: hmUI.text_style.ELLIPSIS,
                        align_h: hmUI.align.RIGHT,
                        unit_type: 1,
                        type: hmUI.data_type.WEATHER_CURRENT,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(buttons, hmUI.widget.IMG_CLICK, {
                        x: 90,
                        y: 90,
                        w: 194,
                        h: 50,
                        src: buttonImage,
                        type: hmUI.data_type.WEATHER_CURRENT,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    renderElements()
                }

                render()
                //#region time_update
                function time_update(updateHour = false, updateMinute = false) {
                    const hour = s.time.hour
                    const minute = s.time.minute
                    const second = s.time.second
                    const format_hour = s.time.format_hour
                    const separator = second % 2 === 0 ? ':' : ' '
                    if (updateHour) {
                        let normal_DayStr = s.time.day.toString()
                        let normal_MonthStr = s.time.month.toString()
                        const normal_YearStr = s.time.year.toString()
                        const day = s.time.week
                        const dayString = dayNames[day - 1]
                        normal_DayStr = normal_DayStr.padStart(2, '0')
                        normal_MonthStr = normal_MonthStr.padStart(2, '0')
                        const normal_DayMonthYearStr = `${normal_YearStr}-${normal_MonthStr}-${normal_DayStr} ${dayString}`
                        e.date.setProperty(
                            hmUI.prop.TEXT,
                            normal_DayMonthYearStr,
                        )
                    }

                    const hourStr = format_hour.toString().padStart(2, '0')
                    const minuteStr = minute.toString().padStart(2, '0')
                    const secondStr = second.toString().padStart(2, '0')

                    let normal_HourMinSecStr = `${hourStr}${separator}${minuteStr}${separator}${secondStr}`

                    if (!s.time.is24Hour) {
                        normal_HourMinSecStr += hour > 11 ? ' Pm' : ' Am'
                    }

                    e.time.setProperty(hmUI.prop.TEXT, normal_HourMinSecStr)

                    // Second Circle
                    let level = (second / 60) * 100
                    if (level === 0) level = 360
                    e.secondCircle.setProperty(hmUI.prop.LEVEL, level)

                    if (updateMinute) {
                        const hourStr = format_hour.toString().padStart(2, '0')
                        const minuteStr = minute.toString().padStart(2, '0')

                        let idle_HourMinStr = `${hourStr}:${minuteStr}`

                        if (!s.time.is24Hour) {
                            idle_HourMinStr += hour > 11 ? ' Pm' : ' Am'
                        }

                        e.aodTime.setProperty(hmUI.prop.TEXT, idle_HourMinStr)
                    }

                    weatherData = s.weather.getForecastWeather()
                    const newCityName = weatherData.cityName
                    if (cityName !== newCityName) {
                        cityName = newCityName
                        console.log('city name update')
                        scale_call()
                    }
                }

                function condition_icon(condition) {
                    if (condition in weather_icons) {
                        return weather_icons[condition]
                    }
                    return condition.toString()
                }

                //#endregion
                function scale_call() {
                    animation = []
                    const newColorCache = []
                    const normal_cityNameStr = weatherData?.cityName || ''
                    const separator = '§'
                    let colors
                    let phoneBattery = '-2'
                    let cityName = 'Default City'
                    let media = ''
                    if (normal_cityNameStr.includes(separator)) {
                        ;[
                            colors,
                            phoneBattery = '-3',
                            volume,
                            cityName = '',
                            media = '',
                        ] = normal_cityNameStr.split(separator)
                    }

                    let fgColorHex,
                        bgColorHex,
                        elementBgColorHex,
                        accentColorHex,
                        accentBgColorHex

                    if (colors) {
                        ;[
                            bgColorHex = '000000',
                            fgColorHex = 'FFFFFF',
                            elementBgColorHex = '333333',
                            accentColorHex = 'FF0000',
                            accentBgColorHex = '666666',
                        ] = colors.match(/.{1,6}/g)

                        fgColor = Number(`0xFF${fgColorHex}`)
                        bgColor = Number(`0xFF${bgColorHex}`)
                        elementBgColor = Number(`0xFF${elementBgColorHex}`)
                        accentColor = Number(`0xFF${accentColorHex}`)
                        accentBgColor = Number(`0xFF${accentBgColorHex}`)
                        init = true
                        console.log('colors set')
                    }
                    newColorCache.push(fgColor)
                    newColorCache.push(bgColor)
                    newColorCache.push(elementBgColor)
                    newColorCache.push(accentColor)
                    newColorCache.push(accentBgColor)
                    newColorCache.push(volume)
                    newColorCache.push(overlay)
                    if (!init) {
                        phoneAction('init')
                    }
                    e.cityName.setProperty(
                        hmUI.prop.TEXT,
                        shorten(cityName, cityLength),
                    )
                    if (!cityName) {
                        e.cityBG.setProperty(hmUI.prop.COLOR, bgColor)
                    } else {
                        e.cityBG.setProperty(hmUI.prop.COLOR, elementBgColor)
                    }
                    e.media.setProperty(
                        hmUI.prop.TEXT,
                        shorten(media, cityLength),
                    )
                    mediaPlaying = false
                    if (!media) {
                        e.mediaBG.setProperty(hmUI.prop.COLOR, bgColor)
                    } else {
                        e.mediaBG.setProperty(hmUI.prop.COLOR, elementBgColor)
                        if (media.startsWith(icons.play)) {
                            mediaPlaying = true
                        }
                    }
                    newColorCache.push(mediaPlaying.toString())
                    const condition =
                        weatherData?.forecastData?.data?.[0]?.index ?? -1
                    e.condition.setProperty(
                        hmUI.prop.TEXT,
                        condition_icon(condition),
                    )

                    const updateProgress = (
                        value,
                        target,
                        text,
                        circle,
                        iconElement,
                        icon,
                    ) => {
                        let progress = value / target
                        if (progress > 1) progress = 1

                        if (screenType !== hmSetting.screen_type.AOD) {
                            const level = Math.round(progress * 100)
                            if (circle)
                                addAnimation(
                                    circle,
                                    0,
                                    level,
                                    100,
                                    'level',
                                    hmUI.prop.MORE,
                                    {
                                        radius: circleRadius,
                                    },
                                )
                            circle.setProperty(hmUI.prop.MORE, {
                                radius: circleRadius,
                                level,
                            })
                            if (text)
                                text.setProperty(hmUI.prop.TEXT, `${value}%`)
                            if (iconElement && icon) {
                                iconElement.setProperty(hmUI.prop.TEXT, icon)
                            }
                        }
                    }

                    updateProgress(
                        s.battery.current,
                        100,
                        e.battery,
                        e.batteryCircle,
                        e.batteryIcon,
                        clocks[s.time.hour % 12],
                    )
                    updateProgress(
                        phoneBattery,
                        100,
                        e.phoneBattery,
                        e.phoneBatteryCircle,
                        e.phoneBatteryIcon,
                        icons.phone,
                    )

                    addSensor('heart', hmSensor.id.HEART)
                    addSensor('sleep', hmSensor.id.SLEEP)
                    addSensor('distance', hmSensor.id.DISTANCE)
                    addSensor('steps', hmSensor.id.STEP)

                    e.steps.setProperty(
                        hmUI.prop.TEXT,
                        s.steps.current.toString(),
                    )
                    const formatDistance = (m) =>
                        m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`
                    e.distance.setProperty(
                        hmUI.prop.TEXT,
                        formatDistance(s.distance.current),
                    )
                    e.heart.setProperty(hmUI.prop.TEXT, `${s.heart.last} bbm`)
                    const toHMM = (m) =>
                        `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
                    e.sleep.setProperty(
                        hmUI.prop.TEXT,
                        `${toHMM(s.sleep.getTotalTime())}`,
                    )

                    newColorCache.push(hmBle.connectStatus().toString())
                    const finalColorCache = newColorCache.join('')
                    if (colorCache !== finalColorCache) {
                        colorCache = finalColorCache
                        render()
                        scale_call()
                        time_update(true, true)
                    }
                }
                const runAnimations = () => {
                    const duration = 1000
                    const fps = 10
                    const steps = Math.round(fps * (duration / 1000))
                    const interval = 1000 / fps

                    if (animationTimer) clearTimeout(animationTimer)

                    const step = (count) => {
                        for (const a of animation) {
                            const {
                                element,
                                from,
                                to,
                                total,
                                prop,
                                type,
                                template,
                            } = a
                            const value = Math.min(
                                Math.round(
                                    from + ((total - from) / steps) * count,
                                ),
                                to,
                            )
                            const set = template
                            set[prop] = value
                            element.setProperty(type, set)
                        }

                        if (count < steps) {
                            animationTimer = setTimeout(
                                () => step(count + 1),
                                interval,
                            )
                        }
                    }

                    step(0)
                }

                const widgetDelegate = hmUI.createWidget(
                    hmUI.widget.WIDGET_DELEGATE,
                    {
                        resume_call: function () {
                            scale_call()
                            time_update(true, true)
                            runAnimations()
                            if (
                                screenType === hmSetting.screen_type.WATCHFACE
                            ) {
                                if (!normal_timerTimeUpdate) {
                                    normal_timerTimeUpdate = timer.createTimer(
                                        0,
                                        1000,
                                        function (option) {
                                            const updateHour =
                                                s.time.minute === 0
                                            const updateMinute =
                                                s.time.second < 2
                                            time_update(
                                                updateHour,
                                                updateMinute,
                                            )
                                        },
                                    ) // end timer
                                } // end timer check
                            } // end screenType

                            if (
                                screenType === hmSetting.screen_type.WATCHFACE
                            ) {
                                if (!normal_timerUpdateSec) {
                                    const animDelay = s.time.utc % 1000
                                    const animRepeat = 1000
                                    normal_timerUpdateSec = timer.createTimer(
                                        animDelay,
                                        animRepeat,
                                        function (option) {
                                            time_update(false, false)
                                        },
                                    ) // end timer
                                } // end timer check
                            } // end screenType

                            if (screenType === hmSetting.screen_type.AOD) {
                                if (!idle_timerTimeUpdate) {
                                    idle_timerTimeUpdate = timer.createTimer(
                                        0,
                                        1000,
                                        function (option) {
                                            const updateHour =
                                                s.time.minute === 0 &&
                                                s.time.second < 2
                                            const updateMinute =
                                                s.time.second < 2
                                            time_update(
                                                updateHour,
                                                updateMinute,
                                            )
                                        },
                                    ) // end timer
                                } // end timer check
                            } // end screenType

                            checkConnection()
                            stopVibro()
                        },
                        pause_call: function () {
                            if (normal_timerTimeUpdate) {
                                timer.stopTimer(normal_timerTimeUpdate)
                                normal_timerTimeUpdate = undefined
                            }
                            if (normal_timerUpdateSec) {
                                timer.stopTimer(normal_timerUpdateSec)
                                normal_timerUpdateSec = undefined
                            }
                            if (idle_timerTimeUpdate) {
                                timer.stopTimer(idle_timerTimeUpdate)
                                idle_timerTimeUpdate = undefined
                            }
                            stopVibro()
                            overlay = ''
                        },
                    },
                )

                //dynamic modify end
            },
            onInit() {
                logger.log('index page.js on init invoke')
            },
            build() {
                this.init_view()
                logger.log('index page.js on ready invoke')
            },
            onDestroy() {
                logger.log('index page.js on destroy invoke')
            },
        })
    })()
} catch (e) {
    console.log('Mini Program Error', e)
    e &&
        e.stack &&
        e.stack.split(/\n/).forEach((i) => console.log('error stack', i))
}
