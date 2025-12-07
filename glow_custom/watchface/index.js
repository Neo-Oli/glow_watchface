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
        //end of ignored block

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

        const icons = {
            disconnect: '󰂲',
            steps: '',
            heart: '󰋑',
            distance: '',
            sleep: '󰒲 ',
        }
        const iconSize = 50
        const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
        let normal_background_bg = ''
        let normal_system_dnd_img = ''
        let normal_system_disconnect = ''
        let normal_sun_high_text_font = ''
        let normal_sun_low_text_font = ''
        let normal_humidity_current_text_font = ''
        let normal_day_month_year_font = ''
        let normal_timerTimeUpdate = undefined
        let normal_battery_circle_scale = ''
        let normal_battery_circle_bg = ''
        let normal_battery_current_text_font = ''
        let normal_city_name_text = ''
        let normal_weather_text = ''
        let normal_temperature_current_text_font = ''
        let normal_time_hour_min_sec_text_font = ''
        let normal_second_circle_scale = ''
        let normal_timerUpdateSec = undefined
        let idle_time_hour_min_text_font = ''
        let idle_timerTimeUpdate = undefined
        let normal_sunrise_jumpable_img_click = ''
        let normal_temperature_jumpable_img_click = ''
        let normal_countdown_jumpable_img_click = ''
        let Button_1 = ''
        let Button_2 = ''
        let timeSensor = ''
        let weatherSensor = ''
        let battery = ''

        let colorCache = ''
        const cacheText = [
            "$|^0123456789 _-.,:;`'% ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz°\\/",
            weather_icons.join(''),
            Object.values(icons).join(''),
        ].join('')

        const statsPos = {
            x: 280,
            y: 310,
            gap: 24,
            size: 24,
        }

        const statsOrder = ['steps', 'distance', 'sleep', 'heart']
        const stats = {
            steps: {
                icon: icons.steps,
                sensorId: hmSensor.id.STEP,
                button: hmUI.data_type.STEP,
                element: '',
                iconElement: '',
                buttonElement: '',
                sensor: '',
            },
            distance: {
                icon: icons.distance,
                sensorId: hmSensor.id.DISTANCE,
                button: hmUI.data_type.STEP,
                element: '',
                iconElement: '',
                buttonElement: '',
                sensor: '',
            },
            heart: {
                icon: icons.heart,
                sensorId: hmSensor.id.HEART,
                button: hmUI.data_type.HEART,
                element: '',
                iconElement: '',
                buttonElement: '',
                sensor: '',
            },
            sleep: {
                icon: icons.sleep,
                sensorId: hmSensor.id.SLEEP,
                button: hmUI.data_type.SLEEP,
                element: '',
                iconElement: '',
                buttonElement: '',
                sensor: '',
            },
        }

        const big = 30
        const small = 18

        const fontCaches = []
        const timeSize = 90
        const timeCoords = {
            x: 35,
            y: 157,
            w: 393,
            h: 90,
            rect_gap: 3,
        }
        const weatherPos = 108
        const weatherGap = 30
        const weatherStart = timeCoords.x + weatherGap
        const weatherHeight = big
        const dateCoords = {
            x: 113,
            y: 60,
            w: 230,
            h: 36,
            rect_gap: 3,
        }
        const cityNameCoords = {
            x: timeCoords.x,
            y: 259,
            w: timeCoords.w,
            h: 39,
            rect_gap: 3,
        }

        const fontSizes = [iconSize, statsPos.size, timeSize, big, small]
        const rectangles = []
        const statsWidth = 120
        const drawRect = [
            timeCoords,
            cityNameCoords,
            dateCoords,
            {
                w: statsWidth,
                h: statsPos.size * statsOrder.length,
                x: statsPos.x,
                y: statsPos.y,
                rect_gap: 3,
            },
            {
                w: timeCoords.w - weatherGap * 2,
                h: weatherHeight,
                x: weatherStart,
                y: weatherPos,
                rect_gap: 3,
            },
        ]

        //dynamic modify end

        __$$module$$__.module = DeviceRuntimeCore.WatchFace({
            init_view() {
                //dynamic modify start
                const del = (widget) => {
                    hmUI.deleteWidget(widget)
                }

                if (!weatherSensor)
                    weatherSensor = hmSensor.createSensor(hmSensor.id.WEATHER)
                if (!battery) {
                    battery = hmSensor.createSensor(hmSensor.id.BATTERY)
                    battery.addEventListener(
                        hmSensor.event.CHANGE,
                        function () {
                            scale_call()
                        },
                    )
                }
                if (!timeSensor)
                    timeSensor = hmSensor.createSensor(hmSensor.id.TIME)
                const screenType = hmSetting.getScreenType()
                function checkConnection() {
                    console.log('checkConnection()')
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

                for (const stat of Object.keys(stats)) {
                    if (!stats[stat].sensor)
                        stats[stat].sensor = hmSensor.createSensor(
                            stats[stat].sensorId,
                        )
                }

                /*
                 * disconnectAlert = hmUI.createWidget(hmUI.widget.DisconnectAlert, {
                 * disconneсnt_vibrate_type: 25,
                 * disconneсnt_toast_text: connection lost,
                 * conneсnt_vibrate_type: 25,
                 * conneсnt_toast_text: connection restored,
                 * });
                 */

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
                const render = (
                    fgColor = 0xffff8c00,
                    bgColor = 0xff000000,
                    elementBgColor = 0xff333333,
                ) => {
                    for (const cache of fontCaches) {
                        del(cache)
                    }
                    for (const size of fontSizes) {
                        fontCaches.push(
                            hmUI.createWidget(hmUI.widget.TEXT, {
                                x: 464,
                                y: 464,
                                w: 10000,
                                h: 22,
                                text_size: size,
                                char_space: 0,
                                line_space: 0,
                                font: 'fonts/3270NerdFontMono-Regular.ttf',
                                color: fgColor,
                                align_h: hmUI.align.LEFT,
                                align_v: hmUI.align.TOP,
                                text_style: hmUI.text_style.ELLIPSIS,
                                text: cacheText,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            }),
                        )
                    }
                    del(normal_background_bg)
                    normal_background_bg = hmUI.createWidget(
                        hmUI.widget.FILL_RECT,
                        {
                            x: 0,
                            y: 0,
                            w: 466,
                            h: 466,
                            color: bgColor,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )
                    for (const rect of rectangles) {
                        del(rect)
                    }
                    for (const rect of drawRect) {
                        rectangles.push(
                            hmUI.createWidget(hmUI.widget.FILL_RECT, {
                                x: rect.x - rect.rect_gap,
                                y: rect.y - rect.rect_gap,
                                w: rect.w + rect.rect_gap * 2,
                                h: rect.h + rect.rect_gap * 2,
                                radius: 0,
                                color: elementBgColor,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            }),
                        )
                    }
                    del(normal_system_dnd_img)
                    normal_system_dnd_img = hmUI.createWidget(
                        hmUI.widget.IMG_STATUS,
                        {
                            x: 185,
                            y: 10,
                            src: 'empty.png',
                            type: hmUI.system_status.DISTURB,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_system_disconnect)
                    normal_system_disconnect = hmUI.createWidget(
                        hmUI.widget.TEXT,
                        {
                            x: 220,
                            y: 10,
                            text: hmBle.connectStatus() ? '' : icons.disconnect,
                            type: hmUI.system_status.DISCONNECT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                            w: 200,
                            h: 50,
                            text_size: iconSize,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            align_h: hmUI.align.LEFT,
                            text_style: hmUI.text_style.NONE,
                            unit_type: 0,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )
                    del(normal_sun_high_text_font)
                    normal_sun_high_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT_FONT,
                        {
                            x: 290,
                            y: weatherPos - 2,
                            w: 150,
                            h: 30,
                            text_size: small,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            type: hmUI.data_type.SUN_RISE,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_sun_low_text_font)
                    normal_sun_low_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT_FONT,
                        {
                            x: 290,
                            y: weatherPos + 12,
                            w: 150,
                            h: 30,
                            text_size: small,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            type: hmUI.data_type.SUN_SET,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_humidity_current_text_font)
                    normal_humidity_current_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT_FONT,
                        {
                            x: 130,
                            y: weatherPos,
                            w: 150,
                            h: weatherHeight,
                            text_size: big,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.RIGHT,
                            unit_type: 1,
                            type: hmUI.data_type.HUMIDITY,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    let countStats = 0
                    for (const key of statsOrder) {
                        del(stats[key].element)
                        del(stats[key].iconElement)
                        stats[key].iconElement = hmUI.createWidget(
                            hmUI.widget.TEXT,
                            {
                                x: statsPos.x,
                                y: statsPos.y + statsPos.gap * countStats,
                                w: statsWidth,
                                h: statsPos.size,
                                text_size: statsPos.size,
                                char_space: 0,
                                font: 'fonts/3270NerdFontMono-Regular.ttf',
                                color: fgColor,
                                line_space: 0,
                                align_v: hmUI.align.TOP,
                                text_style: hmUI.text_style.ELLIPSIS,
                                align_h: hmUI.align.LEFT,
                                text: stats[key].icon,
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            },
                        )
                        stats[key].element = hmUI.createWidget(
                            hmUI.widget.TEXT,
                            {
                                x: statsPos.x + 25,
                                y: statsPos.y + statsPos.gap * countStats,
                                w: statsWidth,
                                h: statsPos.size,
                                text_size: statsPos.size,
                                char_space: 0,
                                font: 'fonts/3270NerdFontMono-Regular.ttf',
                                color: fgColor,
                                line_space: 0,
                                align_v: hmUI.align.TOP,
                                text_style: hmUI.text_style.ELLIPSIS,
                                align_h: hmUI.align.LEFT,
                                text: 'Err',
                                show_level: hmUI.show_level.ONLY_NORMAL,
                            },
                        )
                        countStats += 1
                    }
                    del(normal_day_month_year_font)
                    normal_day_month_year_font = hmUI.createWidget(
                        hmUI.widget.TEXT,
                        {
                            ...dateCoords,
                            text_size: big,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.CENTER_H,
                            // padding: true,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    const batteryCoords = {
                        center_x: 145,
                        center_y: 364,
                        radius: 47,
                    }
                    del(normal_battery_circle_bg)
                    normal_battery_circle_bg = hmUI.createWidget(
                        hmUI.widget.CIRCLE,
                        {
                            ...batteryCoords,
                            color: elementBgColor,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )
                    del(normal_battery_circle_scale)
                    normal_battery_circle_scale = hmUI.createWidget(
                        hmUI.widget.ARC_PROGRESS,
                        {
                            ...batteryCoords,
                            start_angle: 0,
                            end_angle: 360,
                            line_width: 5,
                            corner_flag: 3,
                            color: fgColor,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_battery_current_text_font)
                    normal_battery_current_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT_FONT,
                        {
                            x: 69,
                            y: 346,
                            w: 150,
                            h: 36,
                            text_size: big,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.CENTER_H,
                            unit_type: 1,
                            type: hmUI.data_type.BATTERY,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_weather_text)
                    normal_weather_text = hmUI.createWidget(hmUI.widget.TEXT, {
                        x: 170,
                        y: weatherPos - 10,
                        w: 200,
                        h: iconSize,
                        text_size: iconSize,
                        char_space: 0,
                        font: 'fonts/3270NerdFontMono-Regular.ttf',
                        color: fgColor,
                        line_space: 0,
                        align_v: hmUI.align.CENTER_V,
                        align_h: hmUI.align.LEFT,
                        text_style: hmUI.text_style.NONE,
                        unit_type: 0,
                        text: '',
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    del(normal_city_name_text)
                    normal_city_name_text = hmUI.createWidget(
                        hmUI.widget.TEXT,
                        {
                            ...cityNameCoords,
                            text_size: big,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_temperature_current_text_font)
                    normal_temperature_current_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT_FONT,
                        {
                            x: weatherStart,
                            y: weatherPos,
                            w: 100,
                            h: weatherHeight,
                            text_size: big,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.RIGHT,
                            unit_type: 1,
                            type: hmUI.data_type.WEATHER_CURRENT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_time_hour_min_sec_text_font)
                    normal_time_hour_min_sec_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT,
                        {
                            ...timeCoords,
                            text_size: timeSize,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.CENTER_V,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    /*
                     * normal_second_circle_scale = hmUI.createWidget(hmUI.widget.Circle_Scale, {
                     * center_x: 233,
                     * center_y: 233,
                     * start_angle: 0,
                     * end_angle: 360,
                     * radius: 233,
                     * line_width: 5,
                     * line_cap: Flat,
                     * color: fgColor,
                     * mirror: False,
                     * inversion: False,
                     * alpha: 255,
                     * type: hmUI.data_type.SECOND,
                     * show_level: hmUI.show_level.ONLY_NORMAL,
                     * });
                     */

                    del(normal_second_circle_scale)
                    normal_second_circle_scale = hmUI.createWidget(
                        hmUI.widget.ARC_PROGRESS,
                        {
                            center_x: 233,
                            center_y: 233,
                            start_angle: 0,
                            end_angle: 360,
                            radius: 231,
                            line_width: 5,
                            corner_flag: 3,
                            color: fgColor,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    /*
                     * normal_time_circle_options = hmUI.createWidget(hmUI.widget.TIME_CIRCLE_OPTIONS, {
                     * smooth: false,
                     * format24h: false,
                     * show_level: hmUI.show_level.ONLY_NORMAL,
                     * });
                     */

                    console.log('Watch_Face.ScreenAOD')

                    del(idle_time_hour_min_text_font)
                    idle_time_hour_min_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT,
                        {
                            ...timeCoords,
                            text_size: timeSize,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
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
                    )

                    //#endregion

                    let countStatsButton = 0
                    for (const key of statsOrder) {
                        if (stats[key].button) {
                            del(stats[key].buttonElement)
                            stats[key].buttonElement = hmUI.createWidget(
                                hmUI.widget.IMG_CLICK,
                                {
                                    x: statsPos.x,
                                    y:
                                        statsPos.y +
                                        statsPos.gap * countStatsButton,
                                    w: 200,
                                    h: statsPos.size,
                                    src: 'empty.png',
                                    type: stats[key].button,
                                    show_level: hmUI.show_level.ONLY_NORMAL,
                                },
                            )
                        }
                        countStatsButton += 1
                    }

                    del(normal_sunrise_jumpable_img_click)
                    normal_sunrise_jumpable_img_click = hmUI.createWidget(
                        hmUI.widget.IMG_CLICK,
                        {
                            x: 285,
                            y: 90,
                            w: 60,
                            h: 50,
                            src: 'empty.png',
                            type: hmUI.data_type.SUN_CURRENT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_temperature_jumpable_img_click)
                    normal_temperature_jumpable_img_click = hmUI.createWidget(
                        hmUI.widget.IMG_CLICK,
                        {
                            x: 90,
                            y: 90,
                            w: 194,
                            h: 50,
                            src: 'empty.png',
                            type: hmUI.data_type.WEATHER_CURRENT,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_countdown_jumpable_img_click)
                    normal_countdown_jumpable_img_click = hmUI.createWidget(
                        hmUI.widget.IMG_CLICK,
                        {
                            ...timeCoords,
                            src: 'empty.png',
                            type: hmUI.data_type.COUNT_DOWN,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    console.log('Watch_Face.Buttons')
                    del(Button_1)
                    Button_1 = hmUI.createWidget(hmUI.widget.BUTTON, {
                        x: 41,
                        y: 258,
                        w: 200,
                        h: 999,
                        text: '',
                        color: fgColor,
                        text_size: big,
                        press_src: 'empty.png',
                        normal_src: 'empty.png',
                        click_func: (button_widget) => {
                            hmApp.startApp({
                                url: 'FindPhoneScreen',
                                native: true,
                            })
                        }, // end func
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    }) // end button

                    del(Button_2)
                    Button_2 = hmUI.createWidget(hmUI.widget.BUTTON, {
                        x: 100,
                        y: 40,
                        w: 260,
                        h: 50,
                        text: '',
                        color: fgColor,
                        text_size: big,
                        press_src: 'empty.png',
                        normal_src: 'empty.png',
                        click_func: (button_widget) => {
                            hmApp.startApp({
                                url: 'ScheduleCalScreen',
                                native: true,
                            })
                        }, // end func
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    }) // end button
                }

                render()
                //#region time_update
                function time_update(updateHour = false, updateMinute = false) {
                    console.log('time_update()')
                    const hour = timeSensor.hour
                    const minute = timeSensor.minute
                    const second = timeSensor.second
                    const format_hour = timeSensor.format_hour
                    const separator = second % 2 === 0 ? ':' : ' '
                    if (updateHour) {
                        let normal_DayStr = timeSensor.day.toString()
                        let normal_MonthStr = timeSensor.month.toString()
                        const normal_YearStr = (
                            timeSensor.year % 100
                        ).toString()
                        const day = timeSensor.week
                        const dayString = dayNames[day - 1]
                        normal_DayStr = normal_DayStr.padStart(2, '0')
                        normal_MonthStr = normal_MonthStr.padStart(2, '0')
                        const normal_DayMonthYearStr = `${dayString} ${normal_YearStr}.${normal_MonthStr}.${normal_DayStr}`
                        normal_day_month_year_font.setProperty(
                            hmUI.prop.TEXT,
                            normal_DayMonthYearStr,
                        )
                    }

                    const hourStr = format_hour.toString().padStart(2, '0')
                    const minuteStr = minute.toString().padStart(2, '0')
                    const secondStr = second.toString().padStart(2, '0')

                    let normal_HourMinSecStr = `${hourStr}${separator}${minuteStr}${separator}${secondStr}`

                    if (!timeSensor.is24Hour) {
                        normal_HourMinSecStr += hour > 11 ? ' Pm' : ' Am'
                    }

                    normal_time_hour_min_sec_text_font.setProperty(
                        hmUI.prop.TEXT,
                        normal_HourMinSecStr,
                    )

                    // Second Circle
                    let level = (second / 60) * 100
                    if (level === 0) level = 360
                    normal_second_circle_scale.setProperty(
                        hmUI.prop.LEVEL,
                        level,
                    )

                    if (updateMinute) {
                        const hourStr = format_hour.toString().padStart(2, '0')
                        const minuteStr = minute.toString().padStart(2, '0')

                        let idle_HourMinStr = `${hourStr}:${minuteStr}`

                        if (!timeSensor.is24Hour) {
                            idle_HourMinStr += hour > 11 ? ' Pm' : ' Am'
                        }

                        idle_time_hour_min_text_font.setProperty(
                            hmUI.prop.TEXT,
                            idle_HourMinStr,
                        )
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
                    console.log('scale_call()')

                    const newColorCache = []
                    console.log('Weather city name')
                    const weatherData = weatherSensor.getForecastWeather()
                    const normal_cityNameStr = weatherData.cityName
                    const [
                        cityName = 'Default City',
                        fgColorHex = 'FFFFFF',
                        bgColorHex = '000000',
                        elementBgColorHEX = '333333',
                    ] = normal_cityNameStr.split('%%%')

                    normal_city_name_text.setProperty(hmUI.prop.TEXT, cityName)
                    newColorCache.push(fgColorHex)
                    newColorCache.push(bgColorHex)
                    newColorCache.push(elementBgColorHEX)
                    const condition =
                        weatherData?.forecastData?.data?.[0]?.index ?? -1
                    normal_weather_text.setProperty(
                        hmUI.prop.TEXT,
                        condition_icon(condition),
                    )

                    console.log('update scales BATTERY')

                    const valueBattery = battery.current
                    const targetBattery = 100
                    let progressBattery = valueBattery / targetBattery
                    if (progressBattery > 1) progressBattery = 1
                    const progress_cs_normal_battery = progressBattery

                    if (screenType !== hmSetting.screen_type.AOD) {
                        // normal_battery_circle_scale_circle_scale
                        const level = Math.round(
                            progress_cs_normal_battery * 100,
                        )
                        if (normal_battery_circle_scale) {
                            normal_battery_circle_scale.setProperty(
                                hmUI.prop.MORE,
                                {
                                    center_x: 145,
                                    center_y: 364,
                                    start_angle: 0,
                                    end_angle: 360,
                                    radius: 47,
                                    line_width: 5,
                                    corner_flag: 3,
                                    show_level: hmUI.show_level.ONLY_NORMAL,
                                    level: level,
                                },
                            )
                        }
                    }

                    stats.steps.element.setProperty(
                        hmUI.prop.TEXT,
                        stats.steps.sensor.current.toString(),
                    )
                    const formatDistance = (m) =>
                        m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`
                    stats.distance.element.setProperty(
                        hmUI.prop.TEXT,
                        formatDistance(stats.distance.sensor.current),
                    )
                    stats.heart.element.setProperty(
                        hmUI.prop.TEXT,
                        `${stats.heart.sensor.last} bbm`,
                    )
                    stats.sleep.element.setProperty(
                        hmUI.prop.TEXT,
                        `${stats.sleep.sensor.getTotalTime()}`,
                    )

                    newColorCache.push(hmBle.connectStatus().toString())
                    const finalColorCache = newColorCache.join('')
                    if (colorCache !== finalColorCache) {
                        colorCache = finalColorCache
                        render(
                            Number(`0xFF${fgColorHex}`),
                            Number(`0xFF${bgColorHex}`),
                            Number(`0xFF${elementBgColorHEX}`),
                        )
                        scale_call()
                    }
                }

                const widgetDelegate = hmUI.createWidget(
                    hmUI.widget.WIDGET_DELEGATE,
                    {
                        resume_call: function () {
                            console.log('resume_call()')
                            scale_call()
                            time_update(true, true)
                            if (
                                screenType === hmSetting.screen_type.WATCHFACE
                            ) {
                                if (!normal_timerTimeUpdate) {
                                    normal_timerTimeUpdate = timer.createTimer(
                                        0,
                                        1000,
                                        function (option) {
                                            const updateHour =
                                                timeSensor.minute === 0
                                            const updateMinute =
                                                timeSensor.second < 2
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
                                    const animDelay = timeSensor.utc % 1000
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
                                                timeSensor.minute === 0 &&
                                                timeSensor.second < 2
                                            const updateMinute =
                                                timeSensor.second < 2
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
                            console.log('pause_call()')
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
