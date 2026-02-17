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

        const createGradient = (start, end, pow, length) => {
            const r1 = (start >> 16) & 0xff,
                g1 = (start >> 8) & 0xff,
                b1 = start & 0xff
            const r2 = (end >> 16) & 0xff,
                g2 = (end >> 8) & 0xff,
                b2 = end & 0xff

            // Add 1 to length to account for the inclusive end boundary
            return Array.from({ length: length + 1 }, (_, i) => {
                /*
                 * Use 'length' as the divisor so that the final index (i = length)
                 * results in exactly 1.0 (the end color)
                 */
                const ratio = 1 - Math.pow(1 - i / length, pow)

                const r = Math.round(r1 + (r2 - r1) * ratio)
                const g = Math.round(g1 + (g2 - g1) * ratio)
                const b = Math.round(b1 + (b2 - b1) * ratio)

                return ((r << 16) | (g << 8) | b) >>> 0
            })
        }

        const apiGetData = () => {
            return hmSetting.getUserData().region
        }
        let requesting = ''
        let updateThese = ''
        let requestTemp = ''
        let firstUpdate = true
        let requestingTry = 0
        let chunk = 0
        let lastRequest = ''
        const requestData = (action) => {
            const request = `${action}/${chunk}`
            if (lastRequest !== request) {
                lastRequest = request
                console.log(`DROIDDATA:${request}`)
            }
        }

        const api = {
            fgColor: {
                value: 0xffff8c00,
                key: '0',
                type: 'color',
            },
            bgColor: {
                value: 0xff000000,
                key: '1',
                type: 'color',
            },
            elementBgColor: {
                value: 0xff333333,
                key: '2',
                type: 'color',
            },
            accentColor: {
                value: 0xffff0000,
                key: '3',
                type: 'color',
            },
            accentBgColor: {
                value: 0xff666666,
                key: '4',
                type: 'color',
            },
            colorWallpaper: {
                value: 0xff000000,
                key: '5',
                type: 'color',
            },
            colorWallpaperGradientStart: {
                value: 0xffffffff,
                key: '6',
                type: 'color',
            },
            colorWallpaperGradientPow: {
                value: 1,
                key: '7',
                type: 'number',
            },
            volume: { value: 50, key: '8', type: 'number' },
            phoneBattery: { value: 50, key: '9', type: 'number' },
            infoText: { value: 'No info text', key: 'a', type: 'string' },
            media: { value: 'Loading media', key: 'b', type: 'string' },
            weather: { value: '', key: 'c', type: 'string' },
        }
        const updateApiValue = (key, value) => {
            const apiKey = Object.keys(api).find((k) => api[k].key === key)
            if (!apiKey) {
                console.warn(`No element found with key "${key}"`)
                return
            }

            const type = api[apiKey].type
            if (type === 'number') {
                api[apiKey].value = Number(value)
            } else if (type === 'color') {
                api[apiKey].value = Number(`0xFF${value}`)
            } else if (type === 'string') {
                api[apiKey].value = value
            } else {
                console.warn(`Unknown type: ${type}`)
            }
            console.log(`Set ${apiKey} to ${api[apiKey].value}`)
        }
        const shorten = (str, n) => Array.from(str).slice(0, n).join('')

        const font = 'fonts/3270NerdFontMono-Regular.ttf'

        const filename = 'glow-settings.json'

        const readJsonFile = (filename) => {
            const [stat, err] = hmFS.stat(filename)
            if (err !== 0) {
                console.log('File does not exist')
                return null
            }

            const buf = new Uint8Array(stat.size)
            const fd = hmFS.open(filename, hmFS.O_RDONLY)
            if (fd < 0) {
                console.log('Failed to open file')
                return null
            }

            hmFS.read(fd, buf.buffer, 0, buf.length)
            hmFS.close(fd)

            let json = ''
            for (let i = 0; i < buf.length; i++) {
                json += String.fromCharCode(buf[i])
            }

            try {
                return JSON.parse(json)
            } catch (e) {
                console.log('JSON parse error', e)
                return null
            }
        }

        const weather_icons = {
            thunderstorm: ' ',
            light_rain: '󰖗 ',
            rain: ' ',
            snow: '󰖘 ',
            heavy_snow: '󰼶 ',
            rain_snow: '󰙿 ',
            sleet: ' ',
            fog: '󰖑 ',
            sun: '󰖙 ',
            cloud: ' ',
            heavy_cloud: ' ',
            cloud_sun: '󰖕 ',
            cloud_moon: '󰼱 ',
            clear_night: ' ',
            wind: ' ',
        }

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
            shuffle: '󰒟',
            volume: '󰕾',
            prevPage: '󰅁',
            nextPage: '󰅂',
            playlist: '󰲸',
        }
        const iconSize = 50
        const circleRadius = 47
        const lineWidth = 5
        const buttonImage = 'empty.png'
        const debugImage = 'debug.png'
        const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
        let normal_timer = undefined
        let fast_timer = undefined
        const screensize = 466
        const center = screensize / 2
        const secondGap = 0
        let showSeparator = null

        let overlay = ''

        let baseCache = ''
        let overlayCache = ''
        const cacheText = [
            "$|^0123456789 _-.,:;`'% ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzäöüÄÖÜéè°\\/",
            Object.values(weather_icons).join(''),
            clocks.join(''),
            Object.values(icons).join(''),
        ].join('')

        const statsSize = 24

        const phoneAction = (action) => {
            console.log(`DROIDDO: ${action}`)
        }
        const big = 30
        const small = 18
        const timeSize = 90
        const weatherGap = 30
        const weatherHeight = big

        //const initSettings = readJsonFile(filename)

        /*
         * if (initSettings) {
         * fgColor = initSettings.fgColor ?? fgColor
         * bgColor = initSettings.bgColor ?? bgColor
         * elementBgColor = initSettings.elementBgColor ?? elementBgColor
         * accentColor = initSettings.accentColor ?? accentColor
         * accentBgColor = initSettings.accentBgColor ?? accentBgColor
         * colorWallpaper = initSettings.colorWallpaper ?? colorWallpaper
         * colorWallpaperGradientStart =
         * initSettings.colorWallpaperGradientStart ??
         * colorWallpaperGradientStart
         * colorWallpaperGradientPow =
         * initSettings.colorWallpaperGradientPow ??
         * colorWallpaperGradientPow
         * }
         */

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

        const fontSizes = [iconSize, statsSize, timeSize, big, small]
        const statsWidth = 120
        let newTimer
        const resetTimer = () => {
            newTimer = {
                hour: 0,
                minute: 0,
                second: 0,
            }
        }
        resetTimer()
        const e = {}
        const s = {}

        const base = 'base'
        const over = 'over'
        const layers = { base: [], over: [] }
        const allElements = { base: [], over: [] }
        const bg = 0
        const widgetBg = 1
        const widgetContent = 2
        const overlayLayer = 3
        const buttons = 4
        const addSensor = (name, sensor) => {
            if (!s.hasOwnProperty(name)) {
                s[name] = hmSensor.createSensor(sensor)
                return true
            }
            return false
        }
        const addElement = (group, layer, func, props, name) => {
            if (!(layer in layers[group])) {
                layers[group][layer] = []
            }
            layers[group][layer].push({
                type: func,
                props: props,
                name: name,
            })
            if (name && !e.hasOwnProperty(name)) {
                e[name] = ''
            }
        }
        const prepareElements = (group) => {
            layers[group] = []
        }
        const renderElements = (group) => {
            for (const widget of allElements[group]) {
                hmUI.deleteWidget(widget)
            }
            for (const layer in layers[group]) {
                for (element of layers[group][layer]) {
                    const { type, name, props } = element
                    const widget = hmUI.createWidget(type, props)
                    allElements[group].push(widget)
                    if (name) {
                        e[name] = widget
                    }
                }
            }
        }
        const updateProgress = (
            value,
            target,
            text,
            circle,
            iconElement,
            icon,
            screenType,
        ) => {
            let progress = value / target
            if (progress > 1) progress = 1

            if (screenType !== hmSetting.screen_type.AOD) {
                const level = Math.round(progress * 100)
                circle.setProperty(hmUI.prop.MORE, {
                    radius: circleRadius,
                    level,
                })
                if (text) text.setProperty(hmUI.prop.TEXT, `${value}%`)
                if (iconElement && icon) {
                    iconElement.setProperty(hmUI.prop.TEXT, icon)
                }
            }
        }

        __$$module$$__.module = DeviceRuntimeCore.WatchFace({
            init_view() {
                //dynamic modify start
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

                const drawRect = (coords, name) => {
                    const { x, y, w, h } = coords
                    const gap = 3
                    addElement(
                        base,
                        widgetBg,
                        hmUI.widget.FILL_RECT,
                        {
                            x: x - gap,
                            y: y - gap,
                            w: w + gap * 2,
                            h: h + gap * 2,
                            radius: 0,
                            color: api.elementBgColor.value,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        name,
                    )
                }
                const createStat = (name, icon, button, countStats) => {
                    const x = 280
                    const y = statsStart
                    drawRect({
                        w: statsWidth,
                        h: statsSize,
                        x: x,
                        y: y + statsSize * countStats,
                    })
                    addElement(base, widgetContent, hmUI.widget.TEXT, {
                        x: x,
                        y: y + statsSize * countStats,
                        w: statsWidth,
                        h: statsSize,
                        text_size: statsSize,
                        char_space: 0,
                        font: font,
                        color: api.fgColor.value,
                        line_space: 0,
                        align_v: hmUI.align.TOP,
                        text_style: hmUI.text_style.ELLIPSIS,
                        align_h: hmUI.align.LEFT,
                        text: icon,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(
                        base,
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
                            color: api.fgColor.value,
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
                        addElement(base, widgetContent, hmUI.widget.IMG_CLICK, {
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

                const createCircle = (name, icon, button, circleCount) => {
                    const center_x = 120
                    const center_y = statsStart + circleRadius
                    const gap = 103
                    const x = center_x + gap * circleCount
                    const y = center_y
                    addElement(base, widgetBg, hmUI.widget.CIRCLE, {
                        center_x: x,
                        center_y: y,
                        radius: circleRadius,
                        color: api.elementBgColor.value,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(base, widgetBg, hmUI.widget.ARC_PROGRESS, {
                        center_x: x,
                        center_y: y,
                        radius: circleRadius,
                        start_angle: 0,
                        end_angle: 360,
                        line_width: lineWidth,
                        level: 100,
                        corner_flag: 3,
                        color: api.elementBgColor.value,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.ARC_PROGRESS,
                        {
                            center_x: x,
                            center_y: y,
                            radius: circleRadius,
                            start_angle: 0,
                            end_angle: 360,
                            line_width: lineWidth,
                            corner_flag: 3,
                            color: api.fgColor.value,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        `${name}Circle`,
                    )
                    addElement(
                        base,
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
                            color: api.fgColor.value,
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
                        base,
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
                            color: api.accentColor.value,
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
                        addElement(base, buttons, hmUI.widget.BUTTON, {
                            x: x + gap * circleCount,
                            y: y,
                            w: circleRadius * 2,
                            h: circleRadius * 2,
                            text: '',
                            color: api.fgColor.value,
                            click_func: button,
                            press_src: buttonImage,
                            normal_src: buttonImage,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                    }
                    circleCount += 1
                }

                const createButton = (c, func) => {
                    addElement(over, buttons, hmUI.widget.BUTTON, {
                        h: c.radius,
                        w: c.radius,
                        font: font,
                        color: api.fgColor.value,
                        normal_color: api.elementBgColor.value,
                        press_color: api.fgColor.value,
                        ...c,
                        click_func: (button) => {
                            func(button)
                        },
                    })
                }
                const createArcControl = (name, initialLevel, func) => {
                    const arcWidth = 70
                    const radius = center
                    addElement(over, widgetBg, hmUI.widget.CIRCLE, {
                        center_x: center,
                        center_y: center,
                        radius: radius,
                        color: api.bgColor.value,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(
                        over,
                        widgetBg,
                        hmUI.widget.ARC_PROGRESS,
                        {
                            center_x: center,
                            center_y: center,
                            start_angle: 0,
                            end_angle: 360,
                            level: 100,
                            radius: radius - arcWidth / 2,
                            line_width: arcWidth,
                            color: api.elementBgColor.value,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        `${name}ArcBg`,
                    )
                    addElement(
                        over,
                        widgetContent,
                        hmUI.widget.ARC_PROGRESS,
                        {
                            center_x: center,
                            center_y: center,
                            start_angle: 0,
                            end_angle: 360,
                            level: initialLevel,
                            radius: radius - arcWidth / 2,
                            line_width: arcWidth,
                            color: api.fgColor.value,
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
                            (radius - arcWidth / 2) * Math.cos(angleRad)
                        const y =
                            center +
                            (radius - arcWidth / 2) * Math.sin(angleRad)
                        const newLevel = Math.round(
                            (100 / (numButtons - 1)) * i,
                        )
                        addElement(
                            over,
                            buttons,
                            hmUI.widget.BUTTON,
                            {
                                x: x - arcWidth / 2,
                                y: y - arcWidth / 2,
                                w: arcWidth,
                                h: arcWidth,
                                color: api.fgColor.value,
                                text_size: big,
                                press_src: buttonImage,
                                normal_src: buttonImage,
                                //text: `${newLevel}`,
                                click_func: () => {
                                    func(newLevel)
                                    e[`${name}Arc`].setProperty(
                                        hmUI.prop.MORE,
                                        {
                                            level: newLevel,
                                            radius: radius - arcWidth / 2,
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
                            setOverlay()
                        },
                    )
                }
                const createControls = (
                    buttons,
                    name,
                    num,
                    prev = false,
                    next = false,
                ) => {
                    if (overlay !== `${name}${num}`) {
                        return
                    }
                    addElement(over, widgetBg, hmUI.widget.CIRCLE, {
                        center_x: center,
                        center_y: center,
                        radius: 220,
                        color: api.bgColor.value,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    const buttonSize = circleRadius * 2
                    let y =
                        center -
                        buttonSize / 2 -
                        gap -
                        buttonSize -
                        gap -
                        buttonSize / 2
                    createButton(
                        {
                            text_size: big,
                            text: icons.close,
                            radius: buttonSize,
                            x: center - buttonSize,
                            y: y,
                            w: buttonSize * 2,
                            h: buttonSize / 2,
                        },
                        () => {
                            setOverlay()
                        },
                    )
                    if (prev) {
                        createButton(
                            {
                                text_size: big,
                                text: icons.prevPage,
                                radius: buttonSize,
                                y: center - buttonSize,
                                h: buttonSize * 2,
                                w: buttonSize / 2,
                                x:
                                    center -
                                    (buttonSize * 1.5 +
                                        gap * 2 +
                                        buttonSize / 2),
                            },
                            () => {
                                setOverlay(`${name}${num - 1}`)
                            },
                        )
                    }
                    if (next) {
                        createButton(
                            {
                                text_size: big,
                                text: icons.nextPage,
                                radius: buttonSize,
                                x: center + (buttonSize * 1.5 + gap * 2),
                                y: center - buttonSize,
                                h: buttonSize * 2,
                                w: buttonSize / 2,
                            },
                            () => {
                                setOverlay(`${name}${num + 1}`)
                            },
                        )
                    }
                    const startX = center - buttonSize * 1.5 - gap
                    let x = startX
                    y += gap + buttonSize / 2
                    let count = 0
                    const split = 3
                    for (const button of buttons) {
                        if (button) {
                            createButton(
                                {
                                    text_size: button.icon ? iconSize : small,
                                    text: button.text.replace(/ /g, '\n'),
                                    radius: buttonSize,
                                    x: x,
                                    y: y,
                                },
                                (b) => {
                                    button.func(b)
                                },
                            )
                        }
                        count += 1
                        if (count % split === 0) {
                            x = startX
                            y += gap + buttonSize
                        } else {
                            x += gap + buttonSize
                        }
                    }
                }

                const renderOver = () => {
                    prepareElements(over)
                    if (overlay === 'volume') {
                        createArcControl(
                            'volume',
                            api.volume.value,
                            (level) => {
                                phoneAction(`volume ${level}`)
                            },
                        )
                    }
                    const controls = [
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
                            text: 'timer',
                            func: () => {
                                setOverlay('timer0')
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
                            },
                        },
                        {
                            text: icons.volume,
                            icon: true,
                            func: () => {
                                setOverlay('volume')
                            },
                        },
                        {
                            text: icons.playlist,
                            icon: true,
                            func: () => {
                                phoneAction('playlist')
                                setOverlay()
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
                        {
                            text: 'exit mpv',
                            func: () => {
                                phoneAction('mpvexit')
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
                            text: 'preserve',
                            func: () => {
                                phoneAction('preserve')
                                setOverlay()
                            },
                        },
                        {
                            text: 'light',
                            func: () => {
                                phoneAction('light')
                                setOverlay()
                            },
                        },
                        {
                            text: 'aod',
                            func: () => {
                                phoneAction('aod')
                                setOverlay()
                            },
                        },
                        /*
                         * {
                         * text: 'test function',
                         * func: () => {
                         * lastRareUpdate=0
                         * setOverlay()
                         * },
                         * },
                         */
                    ]
                    const perPage = 9
                    for (let i = 0; i < controls.length; i += perPage) {
                        createControls(
                            controls.slice(i, i + perPage),
                            'controls',
                            Math.round(i / perPage),
                            i !== 0,
                            i + perPage < controls.length,
                        )
                    }

                    createControls(
                        [
                            {
                                text: newTimer.hour.toString().padStart(2, '0'),
                                icon: true,
                                func: (b) => {
                                    newTimer.hour += 1
                                    b.setProperty(
                                        hmUI.prop.TEXT,
                                        newTimer.hour
                                            .toString()
                                            .padStart(2, '0'),
                                    )
                                },
                            },
                            {
                                text: newTimer.minute
                                    .toString()
                                    .padStart(2, '0'),
                                icon: true,
                                func: (b) => {
                                    newTimer.minute += 1
                                    b.setProperty(
                                        hmUI.prop.TEXT,
                                        newTimer.minute
                                            .toString()
                                            .padStart(2, '0'),
                                    )
                                },
                            },
                            {
                                text: newTimer.second
                                    .toString()
                                    .padStart(2, '0'),
                                icon: true,
                                func: (b) => {
                                    newTimer.second += 1
                                    b.setProperty(
                                        hmUI.prop.TEXT,
                                        newTimer.second
                                            .toString()
                                            .padStart(2, '0'),
                                    )
                                },
                            },
                            {
                                text: 'set',
                                func: () => {
                                    phoneAction(
                                        `timer ${newTimer.hour * 3600 + newTimer.minute * 60 + newTimer.second}`,
                                    )
                                    setOverlay()
                                },
                            },
                            {
                                text: 'set silent',
                                func: () => {
                                    phoneAction(
                                        `timerSilent ${newTimer.hour * 3600 + newTimer.minute * 60 + newTimer.second}`,
                                    )
                                    setOverlay()
                                },
                            },
                            {
                                text: 'reset',
                                func: () => {
                                    resetTimer()
                                    renderOver()
                                },
                            },
                            {
                                text: 'cancel current',
                                func: () => {
                                    phoneAction('cancelTimer')
                                },
                            },
                        ],
                        'timer',
                        0,
                        false,
                        false,
                    )
                    renderElements(over)
                }
                const renderBase = () => {
                    prepareElements(base)
                    createCircle(
                        'battery',
                        'Err',
                        () => {
                            setOverlay('controls0')
                        },
                        0,
                    )
                    createCircle(
                        'phoneBattery',
                        icons.phone,
                        () => {
                            setOverlay('volume')
                        },
                        1,
                    )
                    createStat('steps', icons.steps, hmUI.data_type.STEP, 0)
                    createStat(
                        'distance',
                        icons.distance,
                        hmUI.data_type.STEP,
                        1,
                    )
                    createStat('heart', icons.heart, hmUI.data_type.HEART, 2)
                    createStat('sleep', icons.sleep, hmUI.data_type.SLEEP, 3)
                    for (const size of fontSizes) {
                        addElement(base, bg, hmUI.widget.TEXT, {
                            x: 464,
                            y: 464,
                            w: 10000,
                            h: 22,
                            text_size: size,
                            char_space: 0,
                            line_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            align_h: hmUI.align.LEFT,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            text: cacheText,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                    }
                    addElement(base, bg, hmUI.widget.FILL_RECT, {
                        x: 0,
                        y: 0,
                        w: screensize,
                        h: screensize,
                        color: api.bgColor.value,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    //optimize the gradient to reduce the number of elements. Each color will be `opimize` high.
                    const optimize = 10
                    const gradientColors = createGradient(
                        api.colorWallpaperGradientStart.value,
                        api.colorWallpaper.value,
                        api.colorWallpaperGradientPow.value,
                        screensize / optimize,
                    )
                    gradientColors.forEach((color, i) => {
                        addElement(base, bg, hmUI.widget.FILL_RECT, {
                            x: 0,
                            y: i * optimize,
                            w: screensize,
                            h: optimize,
                            color: color,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                    })

                    addElement(base, widgetContent, hmUI.widget.IMG_STATUS, {
                        x: 185,
                        y: 10,
                        src: buttonImage,
                        type: hmUI.system_status.DISTURB,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(base, widgetContent, hmUI.widget.TEXT, {
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
                        color: api.fgColor.value,
                        line_space: 0,
                        align_v: hmUI.align.CENTER_V,
                        align_h: hmUI.align.LEFT,
                        text_style: hmUI.text_style.NONE,
                        unit_type: 0,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            x: 290,
                            y: weatherPos - 2,
                            w: 150,
                            h: 30,
                            text_size: small,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'sunrise',
                    )
                    addElement(base, buttons, hmUI.widget.IMG_CLICK, {
                        x: 285,
                        y: 90,
                        w: 60,
                        h: 50,
                        src: buttonImage,
                        type: hmUI.data_type.SUN_CURRENT,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            x: 290,
                            y: weatherPos + 12,
                            w: 150,
                            h: 30,
                            text_size: small,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'sunset',
                    )

                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            x: 130,
                            y: weatherPos,
                            w: 150,
                            h: weatherHeight,
                            text_size: big,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.RIGHT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'humidity',
                    )

                    //date
                    drawRect(dateCoords)
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...dateCoords,
                            text_size: big,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.CENTER_H,
                            // padding: true,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'date',
                    )
                    addElement(base, buttons, hmUI.widget.BUTTON, {
                        x: 100,
                        y: 40,
                        w: 260,
                        h: 50,
                        text: '',
                        color: api.fgColor.value,
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
                        base,
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
                            color: api.accentColor.value,
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
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...timeCoords,
                            text_size: timeSize,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'time',
                    )
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...timeCoords,
                            text_size: timeSize,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
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
                    addElement(base, buttons, hmUI.widget.BUTTON, {
                        ...timeCoords,
                        text: '',
                        color: api.fgColor.value,
                        click_func: (watchface) => {
                            setOverlay('controls0')
                        },
                        press_src: buttonImage,
                        normal_src: buttonImage,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    const secondRadius = 231
                    addElement(base, widgetBg, hmUI.widget.ARC, {
                        x: secondGap,
                        y: secondGap,
                        h: screensize - secondGap,
                        w: screensize - secondGap,
                        start_angle: 0,
                        end_angle: 360,
                        line_width: lineWidth,
                        color: api.accentBgColor.value,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.ARC,
                        {
                            x: secondGap,
                            y: secondGap,
                            h: screensize - secondGap,
                            w: screensize - secondGap,
                            start_angle: 0,
                            end_angle: 360,
                            line_width: lineWidth,
                            color: api.accentColor.value,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'secondCircle',
                    )

                    const outerCircleWidth = 100
                    addElement(
                        base,
                        overlayLayer,
                        hmUI.widget.ARC,
                        {
                            x: 0 - outerCircleWidth,
                            y: 0 - outerCircleWidth,
                            h: screensize + outerCircleWidth * 2,
                            w: screensize + outerCircleWidth * 2,
                            start_angle: 0,
                            end_angle: 360,
                            line_width: outerCircleWidth,
                            color: 0x000000,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'outerCircle',
                    )

                    //city name
                    drawRect(cityNameCoords, 'cityBG')
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...cityNameCoords,
                            w: 1000,
                            text_size: big,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
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
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...mediaCoords,
                            w: 1000,
                            text_size: big,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'media',
                    )
                    const mediaButtonHeight =
                        cityNameCoords.h + gap + mediaCoords.h
                    addElement(base, buttons, hmUI.widget.BUTTON, {
                        x: mediaCoords.x,
                        y: cityNameCoords.y,
                        w: mediaCoords.w,
                        h: mediaButtonHeight,
                        text: '',
                        color: api.fgColor.value,
                        click_func: (watchface) => {
                            setOverlay('controls0')
                        },
                        press_src: buttonImage,
                        normal_src: buttonImage,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    const weatherStart = timeCoords.x + weatherGap
                    drawRect({
                        w: timeCoords.w - weatherGap * 2,
                        h: weatherHeight,
                        x: weatherStart,
                        y: weatherPos,
                    })
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            x: weatherStart,
                            y: weatherPos,
                            w: 100,
                            h: weatherHeight,
                            text_size: big,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.RIGHT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'temp',
                    )
                    addElement(base, buttons, hmUI.widget.IMG_CLICK, {
                        x: 90,
                        y: 90,
                        w: 194,
                        h: 50,
                        src: buttonImage,
                        type: hmUI.data_type.WEATHER_CURRENT,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
                    renderElements(base)
                }

                renderBase()
                //#region time_update
                function time_update(updateHour = false, updateMinute = false) {
                    if (showSeparator === null) {
                        //make sure it starts out exactly in the first time update
                        showSeparator = true
                    } else {
                        showSeparator = !showSeparator
                    }
                    const hour = s.time.hour
                    const minute = s.time.minute
                    const second = s.time.second
                    const format_hour = s.time.format_hour
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

                    const separator = showSeparator ? ':' : ' '

                    let normal_HourMinSecStr = `${hourStr}${separator}${minuteStr}${separator}${secondStr}`

                    if (!s.time.is24Hour) {
                        normal_HourMinSecStr += hour > 11 ? ' Pm' : ' Am'
                    }

                    e.time.setProperty(hmUI.prop.TEXT, normal_HourMinSecStr)

                    // Second Circle
                    const level = (second / 60) * 360 - 90
                    //if (level === 0) level = 360
                    const pointersize = 6
                    e.secondCircle.setProperty(hmUI.prop.MORE, {
                        start_angle: level - pointersize / 2,
                        end_angle: level + pointersize / 2,
                    })

                    if (updateMinute) {
                        const hourStr = format_hour.toString().padStart(2, '0')
                        const minuteStr = minute.toString().padStart(2, '0')

                        let idle_HourMinStr = `${hourStr}:${minuteStr}`

                        if (!s.time.is24Hour) {
                            idle_HourMinStr += hour > 11 ? ' Pm' : ' Am'
                        }

                        e.aodTime.setProperty(hmUI.prop.TEXT, idle_HourMinStr)
                    }

                    apiUpdate()
                }

                const condition_icon = (condition) => {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            weather_icons,
                            condition,
                        )
                    ) {
                        return weather_icons[condition]
                    }
                    return condition.toString()
                }

                //#endregion
                function scale_call() {
                    console.log('scale_call')
                    const newBaseCache = []
                    const newOverlayCache = []
                    const now = s.time.utc

                    //if (equals === '=' && first === 'i') {
                    /*
                     * console.log('init received')
                     * init = true
                     * const [
                     * bgColorHex = '000000',
                     * fgColorHex = 'FFFFFF',
                     * elementBgColorHex = '333333',
                     * accentColorHex = 'FF0000',
                     * accentBgColorHex = '666666',
                     * colorWallpaperHex = '000000',
                     * colorWallpaperGradientStartHex = '000000',
                     * colorWallpaperGradientPow_ = '1',
                     * ] = data.split(separator)
                     * fgColor = Number(`0xFF${fgColorHex}`)
                     * bgColor = Number(`0xFF${bgColorHex}`)
                     * elementBgColor = Number(`0xFF${elementBgColorHex}`)
                     * accentColor = Number(`0xFF${accentColorHex}`)
                     * accentBgColor = Number(`0xFF${accentBgColorHex}`)
                     * colorWallpaper = Number(`0xFF${colorWallpaperHex}`)
                     * colorWallpaperGradientStart = Number(
                     * `0xFF${colorWallpaperGradientStartHex}`,
                     * )
                     * colorWallpaperGradientPow = Number(
                     * colorWallpaperGradientPow_,
                     * )
                     */
                    /*
                     * const obj = {
                     * fgColor: fgColor,
                     * bgColor: bgColor,
                     * elementBgColor: elementBgColor,
                     * accentColor: accentColor,
                     * accentBgColor: accentBgColor,
                     * colorWallpaper: colorWallpaper,
                     * colorWallpaperGradientStart:
                     * colorWallpaperGradientStart,
                     * colorWallpaperGradientPow:
                     * colorWallpaperGradientPow,
                     * }
                     * const json = JSON.stringify(obj)
                     */
                    /*
                     * const bytes = new Uint8Array(json.length)
                     * for (let i = 0; i < json.length; i++) {
                     * bytes[i] = json.charCodeAt(i)
                     * }
                     */
                    /*
                     * const fd = hmFS.open(
                     * filename,
                     * hmFS.O_RDWR | hmFS.O_CREAT | hmFS.O_TRUNC,
                     * )
                     * hmFS.write(fd, bytes.buffer, 0, bytes.length)
                     * hmFS.close(fd)
                     */
                    //} else if (equals === '=' && first === 'I') {
                    /*
                     * console.log('force init received')
                     * init = false
                     * phoneAction('init')
                     */
                    /*
                     * } else if (equals === '=' && first === 'r') {
                     * lastRareUpdate = now
                     * } else {
                     */
                    /*
                     * const [
                     * phoneBattery = '-3',
                     * newVolume,
                     * cityName = 'No City',
                     * media = 'Loading Media',
                     * ] = dataStr.split(separator)
                     * volume = newVolume
                     */

                    ;[
                        temp = 'Err',
                        condition = 'Err',
                        humidity = 'Err',
                        sunrise = 'Err',
                        sunset = 'Err',
                    ] = api.weather.value.split('£')
                    e.cityName.setProperty(
                        hmUI.prop.TEXT,
                        shorten(api.infoText.value, cityLength),
                    )
                    if (!api.infoText.value) {
                        e.cityBG.setProperty(hmUI.prop.VISIBLE, false)
                    } else {
                        e.cityBG.setProperty(hmUI.prop.VISIBLE, true)
                    }
                    e.media.setProperty(
                        hmUI.prop.TEXT,
                        shorten(api.media.value, cityLength),
                    )
                    mediaPlaying = false
                    if (!api.media.value) {
                        e.mediaBG.setProperty(hmUI.prop.VISIBLE, false)
                    } else {
                        e.mediaBG.setProperty(hmUI.prop.VISIBLE, true)
                        if (api.media.value.startsWith(icons.play)) {
                            mediaPlaying = true
                        }
                    }
                    e.temp.setProperty(hmUI.prop.TEXT, `${temp}°`)
                    e.humidity.setProperty(hmUI.prop.TEXT, `${humidity}%`)
                    e.sunrise.setProperty(hmUI.prop.TEXT, sunrise)
                    e.sunset.setProperty(hmUI.prop.TEXT, sunset)
                    e.condition.setProperty(
                        hmUI.prop.TEXT,
                        condition_icon(condition),
                    )
                    updateProgress(
                        api.phoneBattery.value,
                        100,
                        e.phoneBattery,
                        e.phoneBatteryCircle,
                        e.phoneBatteryIcon,
                        icons.phone,
                        screenType,
                    )
                    newBaseCache.push(api.fgColor.value)
                    newBaseCache.push(api.bgColor.value)
                    newBaseCache.push(api.elementBgColor.value)
                    newBaseCache.push(api.accentColor.value)
                    newBaseCache.push(api.accentBgColor.value)
                    newBaseCache.push(api.colorWallpaper.value)
                    newBaseCache.push(api.colorWallpaperGradientStart.value)
                    newBaseCache.push(api.colorWallpaperGradientPow.value)
                    newOverlayCache.push(api.volume.value)

                    updateProgress(
                        s.battery.current,
                        100,
                        e.battery,
                        e.batteryCircle,
                        e.batteryIcon,
                        clocks[s.time.hour % 12],
                        screenType,
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

                    newOverlayCache.push(overlay)

                    newBaseCache.push(hmBle.connectStatus().toString())
                    const finalBaseCache = newBaseCache.join('')
                    if (baseCache !== finalBaseCache) {
                        baseCache = finalBaseCache
                        renderBase()
                        scale_call()
                        time_update(true, true)
                    }
                    const finalOverlayCache = newOverlayCache.join('')
                    if (overlayCache !== finalOverlayCache) {
                        overlayCache = finalOverlayCache
                        renderOver()
                    }
                }
                const apiUpdate = () => {
                    const data = apiGetData()
                    if (data === 'idle') {
                        if (firstUpdate) {
                            firstUpdate = false
                            phoneAction('dataClear')
                            return
                        }
                        if (fast_timer) {
                            console.log('Stopping fast timer')
                            timer.stopTimer(fast_timer)
                            fast_timer = undefined
                        }
                        lastRequest = ''
                        return
                    } else if (requesting) {
                        if (data.includes(':')) {
                            const s = data.split(':')
                            const key = s[0]
                            const thischunk = parseInt(s[1])
                            const value = s[2]
                            if (key !== requesting) {
                                requesting = ''
                                return
                            }
                            if (thischunk === chunk - 1) {
                                return
                            }
                            if (thischunk !== chunk) {
                                return
                            }
                            requestTemp += value
                            if (requestTemp.endsWith('§')) {
                                const finalData = requestTemp.slice(0, -1)
                                requestTemp = ''
                                const decoded = Buffer.from(
                                    finalData,
                                    'base64',
                                ).toString('utf-8')
                                updateApiValue(requesting, decoded)
                                phoneAction(`ack:${requesting}`)
                                updateThese = updateThese.filter(
                                    (item) => item !== requesting,
                                )
                                requesting = ''
                                scale_call()
                            } else {
                                chunk += 1
                                requestData(requesting)
                                return
                            }
                        } else {
                            requestingTry += 1
                            if (requestingTry >= 100) {
                                requesting = ''
                                requestingTry = 0
                                console.log('timeout')
                                lastRequest = ''
                                return
                            }
                        }
                    } else if (data.startsWith('°')) {
                        firstUpdate = false
                        updateThese = data.slice(1).split('')
                    }

                    if (updateThese.length > 0) {
                        requesting = updateThese[0]
                        chunk = 0
                        const animDelay = s.time.utc % 100
                        const animRepeat = 100
                        if (!fast_timer) {
                            console.log('Creating fast timer')
                            fast_timer = timer.createTimer(
                                animDelay,
                                animRepeat,
                                function () {
                                    apiUpdate()
                                },
                            )
                        }
                        requestData(requesting)
                    }
                }
                const widgetDelegate = hmUI.createWidget(
                    hmUI.widget.WIDGET_DELEGATE,
                    {
                        resume_call: function () {
                            scale_call()
                            time_update(true, true)
                            const animDelay = s.time.utc % 1000
                            const animRepeat = 1000
                            if (!normal_timer) {
                                normal_timer = timer.createTimer(
                                    animDelay,
                                    animRepeat,
                                    function () {
                                        const updateHour = s.time.minute === 0
                                        const updateMinute = s.time.second < 2
                                        time_update(updateHour, updateMinute)
                                    },
                                )
                            }
                            checkConnection()
                            stopVibro()
                        },
                        pause_call: function () {
                            if (normal_timer) {
                                timer.stopTimer(normal_timer)
                                normal_timer = undefined
                            }

                            if (fast_timer) {
                                console.log('Stopping fast timer')
                                timer.stopTimer(fast_timer)
                                fast_timer = undefined
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
