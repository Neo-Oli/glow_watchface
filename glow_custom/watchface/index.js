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
        const is_aod = () => {
            const screenType = hmSetting.getScreenType()
            return screenType === hmSetting.screen_type.AOD
        }

        const delimeter = '‡'
        const makeBased = (data) =>
            Buffer.from(data, 'utf-8').toString('base64')
        const unBase = (data) =>
            Buffer.from(String(data), 'base64').toString('utf-8')
        const decode = (str) => {
            const parts = str.split(delimeter)
            const obj = {}
            for (let i = 0; i < parts.length; i += 2) {
                obj[parts[i]] = parts[i + 1]
            }
            return obj
        }

        const encode = (data) =>
            Object.entries(data)
                .map(([k, v]) => `${k}${delimeter}${v}`)
                .join(delimeter)

        const readFile = (filename) => {
            const def = null
            const [stat, err] = hmFS.stat(filename)
            if (err !== 0) {
                console.log('File does not exist')
                return def
            }

            const buf = new Uint8Array(stat.size)
            const fd = hmFS.open(filename, hmFS.O_RDONLY)
            if (fd < 0) {
                console.log('Failed to open file')
                return def
            }

            hmFS.read(fd, buf.buffer, 0, buf.length)
            hmFS.close(fd)

            let content = ''
            for (let i = 0; i < buf.length; i++) {
                content += String.fromCharCode(buf[i])
            }
            return content
        }

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
            verbose: ' ',
            steps: '',
            heart: '󰋑',
            distance: '',
            sleep: '󰒲',
            mail: '󰇮',
            phone: '󰄜',
            headphones: '󰋋',
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
            error: '',
        }
        const errText = icons.error

        const apiGetData = () => {
            return hmSetting.getUserData().region
        }
        const getApiKey = (key) =>
            Object.keys(api).find((k) => api[k].key === key)
        let requesting = ''
        let requestTemp = ''
        let requestingTry = 0
        let verbose = false
        let requestingTryStuck = 0
        let chunk = 0
        const setRequesting = (on = false) => {
            requesting = on
            requestTemp = ''
            chunk = 0
            requestingTry = 0
            requestingTryStuck = 0
            if (requesting) {
                e.requestingBG.setProperty(hmUI.prop.VISIBLE, true)
                e.requesting.setProperty(hmUI.prop.TEXT, 'request')
                if (!is_aod()) {
                    hmSetting.setBrightScreen(10)
                }
            } else {
                if (!is_aod()) {
                    hmSetting.setBrightScreenCancel()
                }
                e.requestingBG.setProperty(hmUI.prop.VISIBLE, false)
                e.requesting.setProperty(hmUI.prop.TEXT, '')
            }
        }
        const requestData = (ack = false) => {
            const request = `${makeBased(apiString())}$`
            const split = 900
            for (let i = 0; i < request.length; i += split) {
                const segment = request.slice(i, i + split)
                if (ack) {
                    console.log(`DROIDDATAACK:${segment}`)
                } else {
                    console.log(`DROIDDATA:${segment}`)
                }
            }
        }
        const requestChunk = () => {
            console.log(`DROIDCHUNK:${chunk}`)
        }

        const defaultApi = {
            fgColor: {
                value: 0xff0000ff,
                key: '0',
                type: 'color',
            },
            bgColor: {
                value: 0xff777777,
                key: '1',
                type: 'color',
            },
            eBgColor: {
                value: 0xff333333,
                key: '2',
                type: 'color',
            },
            accColor: {
                value: 0xffff0000,
                key: '3',
                type: 'color',
            },
            accBgColor: {
                value: 0xff666666,
                key: '4',
                type: 'color',
            },
            gradientEnd: {
                value: 0xff000000,
                key: '5',
                type: 'color',
            },
            gradientTop: {
                value: 0xffffffff,
                key: '6',
                type: 'color',
            },
            pow: {
                value: 1,
                key: '7',
                type: 'number',
            },
            volume: { value: 0, key: '8', type: 'number' },
            phoneBattery: { value: 0, key: '9', type: 'number' },
            infoText: {
                value: 'No info text',
                key: 'a',
                type: 'string',
            },
            media: {
                value: 'Loading media',
                key: 'b',
                type: 'string',
            },
            temperature: {
                value: -273,
                key: 'c',
                type: 'string',
            },
            condition: {
                value: errText,
                key: 'd',
                type: 'string',
            },
            humidity: {
                value: -1,
                key: 'e',
                type: 'string',
            },
            sunrise: {
                value: '00:00',
                key: 'f',
                type: 'string',
            },
            sunset: {
                value: '00:00',
                key: 'g',
                type: 'string',
            },
            headphones: {
                value: 0,
                key: 'h',
                type: 'number',
            },
            weatherWid: {
                value: errText,
                key: 'i',
                type: 'string',
            },
            mpd: {
                value: '',
                key: 'j',
                type: 'string',
            },
            calendar: {
                value: errText,
                key: 'k',
                type: 'string',
            },
        }
        const api = {}
        const filename = 'glow-settings.txt'

        let initSettings
        const reload = () => {
            initSettings = unBase(readFile(filename))
        }
        reload()

        const apiString = () => {
            const saveData = {}
            Object.values(api).forEach((data) => {
                const key = data.key
                let value = data.value
                if (value === null) {
                    value = ''
                }
                if (data.type === 'color') {
                    saveData[key] = value.toString(16).slice(2)
                } else {
                    saveData[key] = value.toString()
                }
            })
            return encode(saveData)
        }
        const saveApi = () => {
            const data = makeBased(apiString())
            const bytes = new Uint8Array(data.length)
            for (let i = 0; i < data.length; i++) {
                bytes[i] = data.charCodeAt(i)
            }
            const fd = hmFS.open(
                filename,
                hmFS.O_RDWR | hmFS.O_CREAT | hmFS.O_TRUNC,
            )
            hmFS.write(fd, bytes.buffer, 0, bytes.length)
            hmFS.close(fd)
        }

        const applyDelta = (oldText, deltaString) => {
            const warnAndNull = (message) => {
                console.warn(`[delta_apply] ${message}`)
                return null
            }

            if (
                typeof oldText !== 'string' ||
                typeof deltaString !== 'string'
            ) {
                return warnAndNull(
                    'Expected string inputs: oldText and deltaString.',
                )
            }

            const fields =
                deltaString.length === 0 ? [] : deltaString.split('§')
            if (fields.length === 0) return oldText

            if (fields.length % 3 !== 0) {
                return warnAndNull(
                    'Invalid delta format: expected triplets (index§delete_len§insert).',
                )
            }

            let updated = oldText
            let offset = 0

            for (let i = 0; i < fields.length; i += 3) {
                const index = Number.parseInt(fields[i], 10)
                const deleteLen = Number.parseInt(fields[i + 1], 10)
                const insert = fields[i + 2]

                const updatedChars = Array.from(updated)
                const insertChars = Array.from(insert)

                if (!Number.isInteger(index) || index < 0) {
                    return warnAndNull(
                        `Invalid delta index at position ${i}: '${fields[i]}'.`,
                    )
                }

                if (!Number.isInteger(deleteLen) || deleteLen < 0) {
                    return warnAndNull(
                        `Invalid delete length at position ${i + 1}: '${fields[i + 1]}'.`,
                    )
                }

                const start = index + offset
                if (start < 0 || start > updatedChars.length) {
                    return warnAndNull(`Delta start out of bounds: ${start}.`)
                }

                const end = start + deleteLen
                if (end < start || end > updatedChars.length) {
                    return warnAndNull(
                        `Delta delete range out of bounds: ${start}-${end}.`,
                    )
                }

                const nextChars = [
                    ...updatedChars.slice(0, start),
                    ...insertChars,
                    ...updatedChars.slice(end),
                ]
                updated = nextChars.join('')
                offset += insertChars.length - deleteLen
            }

            return updated
        }
        const updateApiValue = (value) => {
            const newString = applyDelta(apiString(), value)
            if (newString) {
                initSettings = newString
                restore()
            } else {
                console.log('Error applying patch')
            }
        }
        const restore = () => {
            Object.entries(defaultApi).forEach(([key, value]) => {
                api[key] = { ...value }
            })
            if (initSettings) {
                const decoded = decode(initSettings)
                Object.entries(decoded).forEach(([key, value]) => {
                    const apiKey = getApiKey(key)
                    if (!apiKey) {
                        console.log(`invalid data in initSettings ${key}`)
                        return
                    }
                    const type = api[apiKey].type
                    if (type === 'number') {
                        if (value === '') {
                            api[apiKey].value = null
                        } else {
                            api[apiKey].value = Number(value)
                        }
                    } else if (type === 'color') {
                        api[apiKey].value = Number(`0xFF${value}`)
                    } else if (type === 'string') {
                        api[apiKey].value = value
                    } else {
                        console.warn(`Unknown type: ${type}`)
                    }
                })
            }
            saveApi()
        }
        restore()
        const font = 'fonts/font.ttf'

        const circleButtonRadius = 47
        const circleRadius = 33
        const circlex = 85
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
        let dynamicCache = ''

        const phoneAction = (action) => {
            console.log(`DROIDDO: ${action}`)
        }
        const statsSize = 24
        const big = 30
        const small = 18
        const iconSize = 50
        const flowTextSize = 21
        const timeSize = 90
        const weatherGap = 30
        const weatherHeight = big

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
            h: 36,
        }
        const mediaCoords = {
            x: cityNameCoords.x,
            y: cityNameCoords.y + cityNameCoords.h + gap,
            w: cityNameCoords.w,
            h: 36,
        }
        const statsStart = mediaCoords.y + mediaCoords.h + gap

        const requestingWidth = 150
        const requestingCoords = {
            x: circlex,
            y: statsStart + circleRadius * 2 + gap,
            w: requestingWidth,
            h: small,
        }

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
        const dynamic = 'dynamic'
        const layers = { base: [], dynamic: [], over: [] }
        const allElements = { base: [], dynamic: [], over: [] }
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
        const renderGroup = (group) => {
            if (verbose) console.log(`renderGroup(${group})`)
            for (const widget of allElements[group]) {
                if (widget) {
                    hmUI.deleteWidget(widget)
                }
            }
            allElements[group] = []
            for (const layer in layers[group]) {
                for (element of layers[group][layer]) {
                    if (element) {
                        const { type, name, props } = element
                        const widget = hmUI.createWidget(type, props)
                        allElements[group].push(widget)
                        if (name) {
                            e[name] = widget
                        }
                    }
                }
            }
        }
        const updateProgress = (value, target, key, icon) => {
            if (!is_aod()) {
                let progress = value / target
                if (progress > 1) progress = 1
                const text = e[key]
                const circle = e[`${key}Circle`]
                const iconElement = e[`${key}Icon`]
                const bg = e[`${key}Bg`]
                const bgCircle = e[`${key}BgCircle`]
                const elements = [text, circle, iconElement, bg, bgCircle]
                if (value !== null) {
                    elements.forEach((element) =>
                        element.setProperty(hmUI.prop.VISIBLE, true),
                    )
                    const level = Math.round(progress * 100)
                    circle.setProperty(hmUI.prop.MORE, {
                        radius: circleRadius,
                        level,
                    })
                    if (text) {
                        text.setProperty(hmUI.prop.TEXT, `${value}%`)
                    }
                    if (iconElement && icon) {
                        iconElement.setProperty(hmUI.prop.TEXT, icon)
                    }
                } else {
                    elements.forEach((element) =>
                        element.setProperty(hmUI.prop.VISIBLE, false),
                    )
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

                const drawRect = ({
                    coords: { x, y, w, h },
                    name,
                    color = api.eBgColor.value,
                    group = base,
                    smallGap = false,
                    show_level = hmUI.show_level.ONLY_NORMAL,
                }) => {
                    const gap = smallGap ? 0 : 3
                    addElement(
                        group,
                        widgetBg,
                        hmUI.widget.FILL_RECT,
                        {
                            x: x - gap,
                            y: y - gap,
                            w: w + gap * 2,
                            h: h + gap * 2,
                            radius: 0,
                            color: color,
                            show_level,
                        },
                        name,
                    )
                }
                const createStat = (name, icon, countStats) => {
                    const x = 280
                    const y = statsStart
                    drawRect({
                        coords: {
                            w: statsWidth,
                            h: statsSize,
                            x: x,
                            y: y + statsSize * countStats,
                        },
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
                            text: errText,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        name,
                    )
                    countStats += 1
                }

                const createCircle = (name, circleCount) => {
                    const center_y = statsStart + circleRadius
                    const circleGap = circleRadius * 2 + gap
                    const x = circlex + circleGap * circleCount
                    const y = center_y
                    addElement(
                        base,
                        widgetBg,
                        hmUI.widget.CIRCLE,
                        {
                            center_x: x,
                            center_y: y,
                            radius: circleRadius,
                            color: api.eBgColor.value,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        `${name}Bg`,
                    )
                    addElement(
                        base,
                        widgetBg,
                        hmUI.widget.ARC_PROGRESS,
                        {
                            center_x: x,
                            center_y: y,
                            radius: circleRadius,
                            start_angle: 0,
                            end_angle: 360,
                            line_width: lineWidth,
                            level: 100,
                            corner_flag: 3,
                            color: api.eBgColor.value,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        `${name}BgCircle`,
                    )
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
                    const circleTextSize = statsSize
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            x: x - circleRadius,
                            y: y - circleTextSize / 2 + 5,
                            w: circleRadius * 2,
                            h: circleTextSize,
                            text_size: circleTextSize,
                            char_space: 0,
                            font: font,
                            color: api.fgColor.value,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.CENTER_H,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                            text: errText,
                        },
                        name,
                    )
                    const circleIconSize = small
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            x: x - circleRadius,
                            y: y - circleTextSize / 2 - circleIconSize + 5,
                            w: circleRadius * 2,
                            h: circleIconSize,
                            text_size: circleIconSize,
                            char_space: 0,
                            font: font,
                            color: api.accColor.value,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.CENTER_H,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                            text: errText,
                        },
                        `${name}Icon`,
                    )
                    circleCount += 1
                }

                const createButton = (c, func) => {
                    addElement(over, buttons, hmUI.widget.BUTTON, {
                        h: c.radius,
                        w: c.radius,
                        font: font,
                        color: api.fgColor.value,
                        normal_color: api.eBgColor.value,
                        press_color: api.fgColor.value,
                        ...c,
                        click_func: (button) => {
                            func(button)
                        },
                    })
                }
                const createArcControl = (name, initialLevel, func) => {
                    if (overlay !== name) {
                        return
                    }
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
                            color: api.eBgColor.value,
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
                    style = 'round',
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
                    const buttonSize = circleButtonRadius * 2
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
                    const square = style === 'square'
                    const split = square ? 1 : 3
                    for (const button of buttons) {
                        if (button) {
                            createButton(
                                {
                                    text_size: button.icon
                                        ? iconSize
                                        : statsSize,
                                    text: square
                                        ? button.text
                                        : button.text.replace(/ /g, '\n'),
                                    radius: square ? 0 : buttonSize,
                                    ...(square && {
                                        w: buttonSize * 3 + gap * 2,
                                        h: buttonSize,
                                        align_h: hmUI.align.LEFT,
                                    }),
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
                const createTextOverlay = (name, text) => {
                    const maxlines = 13

                    const segments = []
                    const lines = text.split('\n')
                    for (let i = 0; i < lines.length; i += maxlines) {
                        segments.push(lines.slice(i, i + maxlines).join('\n'))
                    }

                    segments.forEach((segment, index) => {
                        const indexedName = `${name}${index}`
                        if (overlay !== indexedName) {
                            return
                        }
                        addElement(over, widgetBg, hmUI.widget.CIRCLE, {
                            center_x: center,
                            center_y: center,
                            radius: 220,
                            color: api.bgColor.value,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        })
                        const buttonSize = circleButtonRadius * 2
                        const y =
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
                        const radius = 160
                        const textCoords = {
                            x: center - radius,
                            y: y + buttonSize / 2 + gap,
                            w: radius * 2,
                            h: flowTextSize * maxlines,
                        }
                        createStyledText({
                            coords: textCoords,
                            group: over,
                            text: segment,
                            size: flowTextSize,
                        })

                        if (index !== 0) {
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
                                    setOverlay(`${name}${index - 1}`)
                                },
                            )
                        }
                        if (index !== segments.length - 1) {
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
                                    setOverlay(`${name}${index + 1}`)
                                },
                            )
                        }
                    })
                }
                const createStyledText = ({ group, coords, text, size }) => {
                    if (!text) {
                        return
                    }
                    const { x, y } = coords
                    drawRect({
                        coords: coords,
                        group: group,
                    })
                    const width = size / 2
                    text.split('\n').forEach((line, index) => {
                        const out = (offset, mode, text) => {
                            let textSize = size
                            let iconOffset = size / 6
                            let bgColor = api.eBgColor.value
                            let fgColor = api.fgColor.value
                            //count unicode correctly
                            let textWidth = Array.from(text).length
                            if (mode === 'b') {
                                bgColor = api.fgColor.value
                                fgColor = api.eBgColor.value
                            } else if (mode === 'i') {
                                textSize *= 1.5
                                textWidth = 2
                                iconOffset -= size / 4
                                fgColor = api.accColor.value
                            }
                            const width = size / 2
                            textCoords = {
                                x: x + offset,
                                y: y + size * index,
                                w: (textWidth + 1) * width,
                                h: size,
                            }
                            drawRect({
                                coords: textCoords,
                                group: group,
                                color: bgColor,
                                smallGap: true,
                            })
                            addElement(group, widgetContent, hmUI.widget.TEXT, {
                                ...textCoords,
                                y: textCoords.y + iconOffset,
                                h: textSize,
                                w: textCoords.w * 2,
                                text_size: textSize,
                                font: font,
                                color: fgColor,
                                align_v: hmUI.align.BOTTOM,
                                text_style: hmUI.text_style.ELLIPSIS,
                                align_h: hmUI.align.LEFT,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                                text: text,
                            })
                        }
                        let str = line
                        let offset = 0
                        let cur = ''
                        let mode = 'n'
                        const offsetCompensator = 1
                        while (str.length) {
                            if (str.startsWith('#[')) {
                                if (cur) {
                                    out(offset, mode, cur)
                                }
                                if (mode === 'i') {
                                    offset += width * 2 + offsetCompensator
                                } else {
                                    offset +=
                                        Array.from(cur).length * width +
                                        offsetCompensator
                                }
                                const end = str.indexOf(']')
                                if (end === -1) {
                                    return
                                }
                                mode = str.slice(2, end)
                                str = str.slice(end + 1)
                                cur = ''
                            } else {
                                cur += str.charAt(0)
                                str = str.slice(1)
                            }
                        }
                        if (cur) {
                            out(offset, mode, cur)
                        }
                    })
                }

                const renderOver = () => {
                    prepareElements(over)
                    createArcControl('volume', api.volume.value, (level) => {
                        phoneAction(`volume ${level}`)
                    })

                    createTextOverlay('weather', api.weatherWid.value)
                    createTextOverlay('calendar', api.calendar.value)
                    ;(() => {
                        const controls = [
                            {
                                text: 'clear alarms',
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
                                text: api.media.value.includes(icons.play)
                                    ? icons.pause
                                    : icons.play,
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
                                    setOverlay('Nlist0')
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
                                text: 'find device',
                                func: () => {
                                    phoneAction('findMyDevice')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'no network',
                                func: () => {
                                    phoneAction('no_network')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'pres erve',
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
                            {
                                text: 'reset face',
                                func: () => {
                                    initSettings = null
                                    hmFS.remove(filename)
                                    restore()
                                    phoneAction('dataClear')
                                    setOverlay()
                                },
                            },
                            {
                                text: 'debug',
                                func: () => {
                                    verbose = !verbose
                                    setOverlay()
                                },
                            },
                            /*
                             * {
                             * text: 'test function',
                             * func: () => {
                             * console.log(
                             * JSON.stringify(hmSetting.getUserData()),
                             * )
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
                    })()
                    ;(() => {
                        const perPage = 3
                        const controlString = api.mpd.value
                        if (controlString) {
                            const controls = controlString
                                .split('£')
                                .map((item) => ({
                                    text: item,
                                    func: () => {
                                        phoneAction(`music ${item}`)
                                        setOverlay()
                                    },
                                }))
                            for (let i = 0; i < controls.length; i += perPage) {
                                createControls(
                                    controls.slice(i, i + perPage),
                                    'Nlist',
                                    Math.round(i / perPage),
                                    i !== 0,
                                    i + perPage < controls.length,
                                    'square',
                                )
                            }
                        }
                    })()

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
                    renderGroup(over)
                }
                const renderDynamic = () => {
                    prepareElements(dynamic)
                    createStyledText({
                        coords: cityNameCoords,
                        group: dynamic,
                        text: api.infoText.value,
                        size: big,
                    })
                    createStyledText({
                        coords: mediaCoords,
                        group: dynamic,
                        text: api.media.value,
                        size: big,
                    })
                    renderGroup(dynamic)
                    if (overlay) {
                        renderGroup(over)
                    }
                }
                const renderBase = () => {
                    prepareElements(base)
                    createCircle(
                        'battery',
                        errText,
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
                    createCircle(
                        'headphonesBattery',
                        errText,
                        () => {
                            setOverlay('volume')
                        },
                        2,
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
                        api.gradientTop.value,
                        api.gradientEnd.value,
                        api.pow.value,
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
                        text: !verbose ? '' : icons.verbose,
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
                            text: errText,
                        },
                        'sunrise',
                    )

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
                            text: errText,
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
                            text: errText,
                        },
                        'humidity',
                    )

                    //date
                    drawRect({ coords: dateCoords })
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
                            color: api.accColor.value,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            align_h: hmUI.align.LEFT,
                            text_style: hmUI.text_style.NONE,
                            unit_type: 0,
                            text: errText,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                        'condition',
                    )
                    //time
                    drawRect({ coords: timeCoords })
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
                    addElement(base, widgetBg, hmUI.widget.ARC, {
                        x: secondGap,
                        y: secondGap,
                        h: screensize - secondGap,
                        w: screensize - secondGap,
                        start_angle: 0,
                        end_angle: 360,
                        line_width: lineWidth,
                        color: api.accBgColor.value,
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
                            color: api.accColor.value,
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

                    drawRect({
                        coords: requestingCoords,
                        name: 'requestingBG',
                        color: api.accBgColor.value,
                        show_level:
                            hmUI.show_level.ONLY_NORMAL |
                            hmUI.show_level.ONLY_AOD,
                    })
                    addElement(
                        base,
                        widgetContent,
                        hmUI.widget.TEXT,
                        {
                            ...requestingCoords,
                            text_size: small,
                            char_space: 0,
                            font: font,
                            color: api.accColor.value,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.NONE,
                            align_h: hmUI.align.LEFT,
                            show_level:
                                hmUI.show_level.ONLY_NORMAL |
                                hmUI.show_level.ONLY_AOD,
                        },
                        'requesting',
                    )

                    const weatherStart = timeCoords.x + weatherGap
                    drawRect({
                        coords: {
                            w: timeCoords.w - weatherGap * 2,
                            h: weatherHeight,
                            x: weatherStart,
                            y: weatherPos,
                        },
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
                            text: errText,
                        },
                        'temp',
                    )

                    renderGroup(base)
                }

                renderBase()
                renderDynamic()
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

                //#endregion
                function scale_call() {
                    if (verbose) console.log('scale_call')
                    const newBaseCache = []
                    const newOverlayCache = []
                    const newDynamicCache = []
                    if (!requesting) {
                        e.requestingBG.setProperty(hmUI.prop.VISIBLE, false)
                    }
                    e.temp.setProperty(
                        hmUI.prop.TEXT,
                        `${api.temperature.value}°`,
                    )
                    e.humidity.setProperty(
                        hmUI.prop.TEXT,
                        `${api.humidity.value}%`,
                    )
                    e.sunrise.setProperty(hmUI.prop.TEXT, api.sunrise.value)
                    e.sunset.setProperty(hmUI.prop.TEXT, api.sunset.value)
                    e.condition.setProperty(hmUI.prop.TEXT, api.condition.value)
                    updateProgress(
                        api.phoneBattery.value,
                        100,
                        'phoneBattery',
                        icons.phone,
                    )
                    updateProgress(
                        api.headphones.value,
                        100,
                        'headphonesBattery',
                        icons.headphones,
                    )
                    newBaseCache.push(api.fgColor.value)
                    newBaseCache.push(api.bgColor.value)
                    newBaseCache.push(api.eBgColor.value)
                    newBaseCache.push(api.accColor.value)
                    newBaseCache.push(api.accBgColor.value)
                    newBaseCache.push(api.gradientEnd.value)
                    newBaseCache.push(api.gradientTop.value)
                    newBaseCache.push(api.pow.value)
                    newOverlayCache.push(api.volume.value)
                    newOverlayCache.push(api.mpd.value)
                    newOverlayCache.push(api.weatherWid.value)
                    newOverlayCache.push(api.calendar.value)

                    updateProgress(
                        s.battery.current,
                        100,
                        'battery',
                        clocks[s.time.hour % 12],
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
                    newDynamicCache.push(api.infoText.value)
                    newDynamicCache.push(api.media.value)
                    newBaseCache.push(hmBle.connectStatus().toString())
                    newBaseCache.push(verbose.toString())
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
                    const finalDynamicCache = newDynamicCache.join('')
                    if (dynamicCache !== finalDynamicCache) {
                        dynamicCache = finalDynamicCache
                        renderDynamic()
                    }
                }
                const apiUpdate = () => {
                    const fastTimer = () => {
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
                    }
                    const data = apiGetData()
                    if (is_aod()) {
                        if (data.includes(':')) {
                            console.log('force screen on')
                            hmSetting.setBrightScreen(1)
                        }
                        return
                    }
                    if (verbose) {
                        console.log(data, requesting)
                        console.log(overlay)
                    }
                    if (requesting) {
                        fastTimer()
                        requestingTry += 1
                        if (requestingTry >= 100) {
                            setRequesting()
                            console.log(`timeout. Data ${data}`)
                            return
                        }

                        e.requesting.setProperty(
                            hmUI.prop.TEXT,
                            `loading:${chunk}`,
                        )
                    }

                    if (data === 'idle') {
                        if (fast_timer) {
                            console.log('Stopping fast timer')
                            timer.stopTimer(fast_timer)
                            fast_timer = undefined
                        }
                        setRequesting()
                    } else if (data.includes(':')) {
                        if (!requesting) {
                            requestingTryStuck += 1
                            if (requestingTryStuck >= 100) {
                                console.log(`stuck, unlocking. Data ${data}`)
                                setRequesting(true)
                                requestData()
                                return
                            }
                        }
                        const parts = data.split(':')
                        const thischunk = Number(parts[0])
                        const value = parts.slice(1).join(':')
                        if (thischunk !== chunk) {
                            return
                        }
                        requestingTry = 0
                        requestTemp += value
                        if (requesting) {
                            if (requestTemp.endsWith('$')) {
                                const finalData = requestTemp.slice(0, -1)
                                updateApiValue(unBase(finalData))
                                setRequesting()
                                requestData(true)
                                scale_call()
                            } else {
                                if (!value) {
                                    setRequesting()
                                    return
                                }
                                chunk += 1
                                requestChunk()
                                return
                            }
                        }
                    } else if (data === 'update') {
                        if (!requesting) {
                            setRequesting(true)
                            fastTimer()
                            requestData()
                        }
                    }
                }
                const widgetDelegate = hmUI.createWidget(
                    hmUI.widget.WIDGET_DELEGATE,
                    {
                        resume_call: function () {
                            reload()
                            restore()
                            if (!is_aod() && !requesting) {
                                requestData(true)
                            }
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
