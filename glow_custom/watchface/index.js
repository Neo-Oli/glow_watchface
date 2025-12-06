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

        const disconnectIcon = '󰂲 '

        const iconSize = 50
        const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
        let normal_background_bg = ''
        let normal_system_dnd_img = ''
        let normal_system_disconnect = ''
        let normal_sun_high_text_font = ''
        let normal_sun_low_text_font = ''
        let normal_humidity_current_text_font = ''
        let normal_heart_rate_text_font = ''
        let normal_distance_current_text_font = ''
        let normal_step_current_text_font = ''
        let normal_day_month_year_font = ''
        let normal_timerTimeUpdate = undefined
        let normal_battery_circle_scale = ''
        let normal_battery_current_text_font = ''
        let normal_city_name_text = ''
        let normal_weather_text = ''
        let normal_temperature_current_text_font = ''
        let normal_time_hour_min_sec_text_font = ''
        let normal_second_circle_scale = ''
        let normal_timerUpdateSec = undefined
        let idle_time_hour_min_text_font = ''
        let idle_timerTimeUpdate = undefined
        let normal_step_jumpable_img_click = ''
        let normal_heart_jumpable_img_click = ''
        let normal_sunrise_jumpable_img_click = ''
        let normal_temperature_jumpable_img_click = ''
        let normal_countdown_jumpable_img_click = ''
        let Button_1 = ''
        let Button_2 = ''
        let timeSensor = ''
        let weatherSensor = ''
        let battery = ''

        let fontCache1 = ''
        let fontCache2 = ''
        let fontCache3 = ''
        let fontCache4 = ''
        let fontCache5 = ''
        let fontCache6 = ''

        let colorCache = ''
        const cacheText = [
            "$|^0123456789 _-.,:;`'% ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz°\\/",
            weather_icons.join(''),
            disconnectIcon,
        ].join('')

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
                            vibro(25)
                        }
                        if (status) {
                            hmUI.showToast({ text: 'connection restored' })
                            vibro(25)
                        }
                    })
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
                const render = (fgColor = 0xffff8c00, bgColor = 0xff000000) => {
                    // FontName: 3270NerdFontMono-Regular.ttf; FontSize: 18
                    del(fontCache1)
                    fontCache1 = hmUI.createWidget(hmUI.widget.TEXT, {
                        x: 464,
                        y: 464,
                        w: 298,
                        h: 22,
                        text_size: 18,
                        char_space: 0,
                        line_space: 0,
                        font: 'fonts/3270NerdFontMono-Regular.ttf',
                        color: fgColor,
                        align_h: hmUI.align.LEFT,
                        align_v: hmUI.align.TOP,
                        text_style: hmUI.text_style.ELLIPSIS,
                        text: cacheText,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    // FontName: 3270NerdFontMono-Regular.ttf; FontSize: 36
                    del(fontCache2)
                    fontCache2 = hmUI.createWidget(hmUI.widget.TEXT, {
                        x: 464,
                        y: 464,
                        w: 567,
                        h: 48,
                        text_size: 36,
                        char_space: 0,
                        line_space: 0,
                        font: 'fonts/3270NerdFontMono-Regular.ttf',
                        color: fgColor,
                        align_h: hmUI.align.RIGHT,
                        align_v: hmUI.align.CENTER_V,
                        text_style: hmUI.text_style.ELLIPSIS,
                        text: cacheText,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    // FontName: 3270NerdFontMono-Regular.ttf; FontSize: 20; Cache: full
                    del(fontCache3)
                    fontCache3 = hmUI.createWidget(hmUI.widget.TEXT, {
                        x: 464,
                        y: 464,
                        w: 24,
                        h: 24,
                        text_size: 20,
                        char_space: 0,
                        line_space: 0,
                        font: 'fonts/3270NerdFontMono-Regular.ttf',
                        color: fgColor,
                        align_h: hmUI.align.LEFT,
                        align_v: hmUI.align.TOP,
                        text_style: hmUI.text_style.NONE,
                        text: cacheText,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    // FontName: 3270NerdFontMono-Regular.ttf; FontSize: 36; Cache: full
                    del(fontCache4)
                    fontCache4 = hmUI.createWidget(hmUI.widget.TEXT, {
                        x: 464,
                        y: 464,
                        w: 43,
                        h: 43,
                        text_size: 36,
                        char_space: 0,
                        line_space: 0,
                        font: 'fonts/3270NerdFontMono-Regular.ttf',
                        color: fgColor,
                        align_h: hmUI.align.LEFT,
                        align_v: hmUI.align.CENTER_V,
                        text_style: hmUI.text_style.NONE,
                        text: cacheText,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    // FontName: 3270NerdFontMono-Regular.ttf; FontSize: 90
                    del(fontCache5)
                    fontCache5 = hmUI.createWidget(hmUI.widget.TEXT, {
                        x: 464,
                        y: 464,
                        w: 1461,
                        h: 117,
                        text_size: 90,
                        char_space: 0,
                        line_space: 0,
                        font: 'fonts/3270NerdFontMono-Regular.ttf',
                        color: fgColor,
                        align_h: hmUI.align.LEFT,
                        align_v: hmUI.align.BOTTOM,
                        text_style: hmUI.text_style.ELLIPSIS,
                        text: cacheText,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    console.log('Watch_Face.ScreenNormal')
                    del(fontCache6)
                    fontCache6 = hmUI.createWidget(hmUI.widget.TEXT, {
                        x: 464,
                        y: 464,
                        w: 10000,
                        h: 117,
                        text_size: iconSize,
                        char_space: 0,
                        line_space: 0,
                        font: 'fonts/3270NerdFontMono-Regular.ttf',
                        color: fgColor,
                        align_h: hmUI.align.LEFT,
                        align_v: hmUI.align.BOTTOM,
                        text_style: hmUI.text_style.ELLIPSIS,
                        text: cacheText,
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })
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
                            text: hmBle.connectStatus() ? '' : disconnectIcon,
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
                            y: 102,
                            w: 150,
                            h: 30,
                            text_size: 18,
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
                            y: 116,
                            w: 150,
                            h: 30,
                            text_size: 18,
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
                            y: 100,
                            w: 150,
                            h: 36,
                            text_size: 36,
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

                    del(normal_heart_rate_text_font)
                    normal_heart_rate_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT_FONT,
                        {
                            x: 321,
                            y: 350,
                            w: 150,
                            h: 30,
                            text_size: 20,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            unit_type: 1,
                            type: hmUI.data_type.HEART,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_distance_current_text_font)
                    normal_distance_current_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT_FONT,
                        {
                            x: 321,
                            y: 330,
                            w: 150,
                            h: 50,
                            text_size: 20,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            unit_type: 1,
                            type: hmUI.data_type.DISTANCE,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_step_current_text_font)
                    normal_step_current_text_font = hmUI.createWidget(
                        hmUI.widget.TEXT_FONT,
                        {
                            x: 321,
                            y: 310,
                            w: 150,
                            h: 30,
                            text_size: 20,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.TOP,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            unit_type: 2,
                            type: hmUI.data_type.STEP,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )
                    del(normal_day_month_year_font)
                    normal_day_month_year_font = hmUI.createWidget(
                        hmUI.widget.TEXT,
                        {
                            x: 113,
                            y: 52,
                            w: 230,
                            h: 36,
                            text_size: 36,
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

                    /*
                     * normal_battery_circle_scale = hmUI.createWidget(hmUI.widget.Circle_Scale, {
                     * center_x: 145,
                     * center_y: 364,
                     * start_angle: 0,
                     * end_angle: 360,
                     * radius: 49,
                     * line_width: 5,
                     * line_cap: Flat,
                     * color: fgColor,
                     * mirror: False,
                     * inversion: False,
                     * alpha: 255,
                     * type: hmUI.data_type.BATTERY,
                     * show_level: hmUI.show_level.ONLY_NORMAL,
                     * });
                     */

                    del(normal_battery_circle_scale)
                    normal_battery_circle_scale = hmUI.createWidget(
                        hmUI.widget.ARC_PROGRESS,
                        {
                            center_x: 145,
                            center_y: 364,
                            start_angle: 0,
                            end_angle: 360,
                            radius: 47,
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
                            text_size: 36,
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
                        y: 90,
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
                        text: '',
                        show_level: hmUI.show_level.ONLY_NORMAL,
                    })

                    del(normal_city_name_text)
                    normal_city_name_text = hmUI.createWidget(
                        hmUI.widget.TEXT,
                        {
                            x: 45,
                            y: 254,
                            w: 380,
                            h: 39,
                            text_size: 36,
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
                            x: 65,
                            y: 100,
                            w: 100,
                            h: 36,
                            text_size: 36,
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
                            x: 37,
                            y: 157,
                            w: 999,
                            h: 100,
                            text_size: 90,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.BOTTOM,
                            text_style: hmUI.text_style.ELLIPSIS,
                            align_h: hmUI.align.LEFT,
                            /*
                             * padding: true,
                             * unit_type: 1,
                             * unit_end: 1,
                             */
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
                            x: 37,
                            y: 157,
                            w: 999,
                            h: 100,
                            text_size: 90,
                            char_space: 0,
                            font: 'fonts/3270NerdFontMono-Regular.ttf',
                            color: fgColor,
                            line_space: 0,
                            align_v: hmUI.align.BOTTOM,
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
                    console.log('Watch_Face.Shortcuts')

                    del(normal_step_jumpable_img_click)
                    normal_step_jumpable_img_click = hmUI.createWidget(
                        hmUI.widget.IMG_CLICK,
                        {
                            x: 319,
                            y: 300,
                            w: 116,
                            h: 50,
                            src: 'empty.png',
                            type: hmUI.data_type.STEP,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

                    del(normal_heart_jumpable_img_click)
                    normal_heart_jumpable_img_click = hmUI.createWidget(
                        hmUI.widget.IMG_CLICK,
                        {
                            x: 318,
                            y: 351,
                            w: 100,
                            h: 50,
                            src: 'empty.png',
                            type: hmUI.data_type.HEART,
                            show_level: hmUI.show_level.ONLY_NORMAL,
                        },
                    )

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
                            x: 41,
                            y: 157,
                            w: 384,
                            h: 100,
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
                        text_size: 25,
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
                        text_size: 25,
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

                    console.log('day/month/year font')
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

                    console.log('hour:min:sec font')

                    const hourStr = format_hour.toString().padStart(2, '0')
                    const minuteStr = minute.toString().padStart(2, '0')
                    const secondStr = second.toString().padStart(2, '0')

                    let normal_HourMinSecStr = `${hourStr}:${minuteStr}:${secondStr}`

                    if (!timeSensor.is24Hour) {
                        normal_HourMinSecStr += hour > 11 ? ' Pm' : ' Am'
                    }

                    normal_time_hour_min_sec_text_font.setProperty(
                        hmUI.prop.TEXT,
                        normal_HourMinSecStr,
                    )

                    // Second Circle
                    normal_second_circle_scale.setProperty(
                        hmUI.prop.LEVEL,
                        (second / 60) * 100,
                    )

                    console.log('hour:min font')

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
                    ] = normal_cityNameStr.split('%%%')

                    normal_city_name_text.setProperty(hmUI.prop.TEXT, cityName)
                    newColorCache.push(fgColorHex)
                    newColorCache.push(bgColorHex)
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
                    newColorCache.push(hmBle.connectStatus().toString())
                    const finalColorCache = newColorCache.join('')
                    if (colorCache !== finalColorCache) {
                        colorCache = finalColorCache
                        render(
                            Number(`0xFF${fgColorHex}`),
                            Number(`0xFF${bgColorHex}`),
                        )
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
